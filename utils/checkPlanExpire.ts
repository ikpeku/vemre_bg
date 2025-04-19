export function isSubscriptionExpiredToday({startDate, account_status}: {startDate: Date, account_status: "Basic" | "Platinum" | "Gold",}) {
    const start = new Date(startDate);
    const expiration = new Date(start);
  
    if(account_status !== "Basic"){
      expiration.setFullYear(start.getFullYear() + 1);
    }
  
    const today = new Date();
  
    const formatDate = (date:Date) => date.toISOString().split('T')[0];
  
    return formatDate(today) === formatDate(expiration);
  }