function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(() => {
    let lim = [1800, 300];
    let msg = ["Get to work", "Take a break"];
    let prev = new Date().getTime(), elapsed = 0, mode = 0;
    let stats = { start: prev, total: 0 };

    function setMode(now, x) {
        mode = x;
        elapsed = 0;
        prev = now;
        new Notification(msg[mode]);
    }

    function tickClock() {
        let now = new Date().getTime();
        elapsed = Math.floor((now - prev) / 1000);
        stats.total = Math.floor((now - stats.start) / 1000);
        if (elapsed >= lim[mode]) {
            setMode(now, 1-mode);
        }
        updateDisplay();
    }

    function updateDisplay() {
        document.getElementById('mode').textContent = msg[mode];

        let min = Math.floor(elapsed/60).toString().padStart(2,'0');
        let sec = (elapsed % 60).toString().padStart(2,'0');
        let formatted = `${min}:${sec}`;
        document.getElementById('clock').textContent = formatted;

        hour = Math.floor(stats.total/3600).toString().padStart(2,'0');
        min = Math.floor(stats.total%3600/60).toString().padStart(2,'0');
        sec = (stats.total%60).toString().padStart(2,'0');
        formatted = `${hour}:${min}:${sec}`;
        document.getElementById('stats-total').textContent = formatted;
    }

    setInterval(tickClock, 200);

    document.getElementById('toggle-work').onclick = () => {
        setMode(new Date().getTime(), 0);
    };

    document.getElementById('toggle-break').onclick = () => {
        setMode(new Date().getTime(), 1);
    };

    document.getElementById('show-help').onclick = () => {
        alert('intervals (sec): ' + lim);
    };
});

