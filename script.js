function updateCalender() {
    const now = new Date();
    const day = now.getDate();
    const monthnames = ["january", "february", "march", "april", "may", 
        "june", "july", "august", "september", "october", "november", "december"];
    const month = monthnames[now.getMonth()];

    const year = now.getFullYear(); 

    document.getElementById("day").textContent = day;
    document.getElementById("month").textContent = month;
    document.getElementById("year").textContent = year;
}

document.getElementById("closeBtn").addEventListener("click", () => {
  window.api.close();
});

updateCalender();