// Streak & Reading Habit Calculation Engine

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate user streaks, consistency and habit stats from reading logs
 */
export function calculateUserStreaks(logs, userBooks = [], referenceDate = new Date()) {
  const refDateStr = formatDate(referenceDate);
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // Group logs by date
  const dateMap = {};
  let totalPages = 0;
  let totalMinutes = 0;

  logs.forEach(log => {
    const d = log.date;
    if (!dateMap[d]) {
      dateMap[d] = {
        date: d,
        pages: 0,
        minutes: 0,
        count: 0,
        notes: []
      };
    }
    dateMap[d].pages += (log.pagesRead || 0);
    dateMap[d].minutes += (log.minutesRead || 0);
    dateMap[d].count += 1;
    if (log.note) dateMap[d].notes.push(log.note);

    totalPages += (log.pagesRead || 0);
    totalMinutes += (log.minutesRead || 0);
  });

  const activeDates = Object.keys(dateMap).sort();
  const activeDateSet = new Set(activeDates);

  // 1. Calculate Current Active Streak
  let currentStreak = 0;
  let hasLoggedToday = activeDateSet.has(refDateStr);
  let hasLoggedYesterday = activeDateSet.has(yesterdayStr);

  let checkDate = new Date(referenceDate);
  if (!hasLoggedToday) {
    if (hasLoggedYesterday) {
      checkDate = yesterday;
    } else {
      currentStreak = 0;
    }
  }

  if (hasLoggedToday || hasLoggedYesterday) {
    let streakCounter = 0;
    let curr = new Date(checkDate);
    while (true) {
      const dStr = formatDate(curr);
      if (activeDateSet.has(dStr)) {
        streakCounter++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = streakCounter;
  }

  // 2. Calculate Longest Streak Record
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  activeDates.forEach(dateStr => {
    const currDate = new Date(dateStr + "T00:00:00");
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    prevDate = currDate;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  });

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // 3. Monthly & Yearly Consistency
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth(); // 0-indexed
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayOfMonth = referenceDate.getDate();

  let daysReadThisMonth = 0;
  let pagesThisMonth = 0;
  let minutesThisMonth = 0;

  let daysReadThisYear = 0;
  let pagesThisYear = 0;

  activeDates.forEach(dateStr => {
    const d = new Date(dateStr + "T00:00:00");
    if (d.getFullYear() === currentYear) {
      daysReadThisYear++;
      pagesThisYear += dateMap[dateStr].pages;

      if (d.getMonth() === currentMonth) {
        daysReadThisMonth++;
        pagesThisMonth += dateMap[dateStr].pages;
        minutesThisMonth += dateMap[dateStr].minutes;
      }
    }
  });

  const monthConsistencyPercent = Math.round((daysReadThisMonth / dayOfMonth) * 100) || 0;

  // 4. Books completed this year
  const completedBooks = userBooks.filter(b => b.status === "completed");
  const completedThisYear = completedBooks.filter(b => {
    if (!b.finishDate) return false;
    return new Date(b.finishDate).getFullYear() === currentYear;
  });

  // 5. Monthly Breakdown for Charts (Jan - Dec of current year)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyBooksMap = {};
  const monthlyPagesMap = {};
  monthNames.forEach((m, idx) => {
    monthlyBooksMap[idx] = 0;
    monthlyPagesMap[idx] = 0;
  });

  completedBooks.forEach(b => {
    if (b.finishDate) {
      const fd = new Date(b.finishDate);
      if (fd.getFullYear() === currentYear) {
        monthlyBooksMap[fd.getMonth()] = (monthlyBooksMap[fd.getMonth()] || 0) + 1;
      }
    }
  });

  activeDates.forEach(dateStr => {
    const d = new Date(dateStr + "T00:00:00");
    if (d.getFullYear() === currentYear) {
      monthlyPagesMap[d.getMonth()] = (monthlyPagesMap[d.getMonth()] || 0) + dateMap[dateStr].pages;
    }
  });

  const monthlyChartData = monthNames.map((name, idx) => ({
    month: name,
    books: monthlyBooksMap[idx] || 0,
    pages: monthlyPagesMap[idx] || 0
  }));

  // 6. Genre Distribution
  const genreCount = {};
  userBooks.forEach(b => {
    const g = b.genre || "Other";
    genreCount[g] = (genreCount[g] || 0) + 1;
  });
  const genreData = Object.entries(genreCount).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / (userBooks.length || 1)) * 100)
  }));

  // 7. Format Distribution
  const formatCount = { Physical: 0, "E-Book": 0, Audiobook: 0 };
  userBooks.forEach(b => {
    if (formatCount[b.format] !== undefined) {
      formatCount[b.format]++;
    } else {
      formatCount["Physical"]++;
    }
  });

  // 8. 365-day Heatmap Data Grid
  const heatmap = [];
  const startDay = new Date(referenceDate);
  startDay.setDate(startDay.getDate() - 120); // Last ~4 months or current season

  let iter = new Date(startDay);
  while (iter <= referenceDate) {
    const dStr = formatDate(iter);
    const logInfo = dateMap[dStr];
    let level = 0;
    if (logInfo) {
      if (logInfo.pages >= 50 || logInfo.minutes >= 50) level = 4;
      else if (logInfo.pages >= 30 || logInfo.minutes >= 30) level = 3;
      else if (logInfo.pages >= 15 || logInfo.minutes >= 15) level = 2;
      else if (logInfo.pages > 0 || logInfo.minutes > 0) level = 1;
    }
    heatmap.push({
      date: dStr,
      level,
      pages: logInfo ? logInfo.pages : 0,
      minutes: logInfo ? logInfo.minutes : 0,
      notes: logInfo ? logInfo.notes : []
    });
    iter.setDate(iter.getDate() + 1);
  }

  // 9. Badges
  const badges = [
    { id: "streak-3", title: "Habit Spark", desc: "3-Day Reading Streak", icon: "✨", unlocked: currentStreak >= 3 || longestStreak >= 3 },
    { id: "streak-7", title: "Weekly Champion", desc: "7-Day Reading Streak", icon: "🔥", unlocked: currentStreak >= 7 || longestStreak >= 7 },
    { id: "streak-14", title: "Fortnight Master", desc: "14-Day Reading Streak", icon: "⚡", unlocked: currentStreak >= 14 || longestStreak >= 14 },
    { id: "streak-30", title: "Reading Legend", desc: "30-Day Reading Streak", icon: "👑", unlocked: currentStreak >= 30 || longestStreak >= 30 },
    { id: "century", title: "Century Reader", desc: "Read over 100 pages in history", icon: "📚", unlocked: totalPages >= 100 },
    { id: "polymath", title: "Genre Polymath", desc: "Read 3+ different genres", icon: "🎨", unlocked: Object.keys(genreCount).length >= 3 }
  ];

  return {
    currentStreak,
    longestStreak,
    hasLoggedToday,
    daysReadThisMonth,
    daysInCurrentMonth,
    dayOfMonth,
    monthConsistencyPercent,
    daysReadThisYear,
    totalPages,
    totalMinutes,
    completedBooksCount: completedBooks.length,
    completedThisYearCount: completedThisYear.length,
    monthlyChartData,
    genreData,
    formatCount,
    heatmap,
    badges,
    dateMap
  };
}
