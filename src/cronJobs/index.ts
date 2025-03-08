import { IPlan } from "@/models/plan.model";
import { Subscription } from "@/models/subscription.model";
import { IUser } from "@/models/user.model";
import { InvoiceService } from "@/services/invoice.service";
import { MailService } from "@/services/mail.service";
import { SubscriptionService } from "@/services/subscription.service";
import { endOfDay, startOfDay, subDays } from "date-fns";
import cron from "node-cron";

// Cron Job: Runs every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("Running subscription reminder job...");
  const reminderStartOfDate = startOfDay(subDays(new Date(), -3));
  const reminderEndOfDate = endOfDay(subDays(new Date(), -3));

  const expiringSubscriptions = await Subscription.find({
    endDate: {
      $gte: reminderStartOfDate,
      $lte: reminderEndOfDate,
    },
    status: "ACTIVE",
  })
    .populate<{ user: IUser }>("user")
    .populate<{ plan: IPlan }>("plan");

  for (const subscription of expiringSubscriptions) {
    if (!subscription.user) continue;

    // Create alert invoice
    await InvoiceService.createInvoice({
      user: subscription.user.id,
      subscription: subscription.id,
      amount: subscription.plan.id,
      currency: "", // TODO find a way to make currency
      dueDate: subscription.endDate,
      status: "ALERT",
    });

    await MailService.sendReminderEmail({
      toEmail: subscription.user.email,
      expiryDate: subscription.endDate,
      planName: subscription.plan.name,
    });
  }
  console.log("Subscription reminder cron job scheduled.");
});

cron.schedule("0 0 * * *", async () => {
  console.log("Running subscription expire status change cron job...");
  const reminderStartOfDate = startOfDay(new Date());
  const reminderEndOfDate = endOfDay(new Date());

  const expiringSubscriptions = await Subscription.find({
    endDate: {
      $gte: reminderStartOfDate,
      $lte: reminderEndOfDate,
    },
    status: "ACTIVE",
  })
    .populate<{ user: IUser }>("user")
    .populate<{ plan: IPlan }>("plan");

  for (const subscription of expiringSubscriptions) {
    if (!subscription) continue;

    // Create overdue invoice
    await InvoiceService.createInvoice({
      user: subscription.user.id,
      subscription: subscription.id,
      amount: subscription.plan.id,
      currency: "", // TODO find a way to make currency
      dueDate: subscription.endDate,
      status: "EXPIRED",
    });
    await SubscriptionService.updateSubscription(subscription.id, {
      status: "EXPIRED",
    });
  }
  console.log("Subscription expire status change cron job scheduled.");
});
