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
    const lim = [1800, 300];
    const msg = ["Get to work", "Take a break"];
    let isSoundOn = false;
    let prev, elapsed, mode;
    let stats;

    function init() {
        prev = new Date().getTime();
        elapsed = 0;
        mode = 0;
        stats = { start: prev, total: 0 };
    }

    function setMode(now, x) {
        mode = x;
        elapsed = 0;
        prev = now;
        new Notification(msg[mode]);
	console.log(isSoundOn)
	if (isSoundOn){
		var audio = new Audio('bell.mp3');
		audio.play();
	}
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

        let remaining = lim[mode] - elapsed;
        let min = Math.floor(remaining/60).toString().padStart(2,'0');
        let sec = (remaining % 60).toString().padStart(2,'0');
        let formatted = `${min}:${sec}`;
        document.getElementById('clock').textContent = formatted;

        hour = Math.floor(stats.total/3600).toString().padStart(2,'0');
        min = Math.floor(stats.total%3600/60).toString().padStart(2,'0');
        sec = (stats.total%60).toString().padStart(2,'0');
        formatted = `${hour}:${min}:${sec}`;
        document.getElementById('stats-total').textContent = formatted;
    }

    init();
    setInterval(tickClock, 200);

    let settingsModal = `
        <div class="modal">
            <div class="content">
                <div class="title">
                    Settings
                </div>
                <form>
                    <div class="row">
                        <label>Work Time</label>
                        <input type="number" name="workTime">s
                    </div>
                    <div class="row">
                        <label>Break Time</label>
                        <input type="number" name="breakTime">s<br>
                    </div>
		    <div class="row">
		    	<label>Play sound</label>
			<input type="checkbox" name="playSound">
		    </div>

                    <div class="row submit">
                        <input type="button" value="Ok">
                        <input type="button" value="Cancel">
                    </div>
                </form>
            </div>
        </div>
    `;

    let infoModal = `
        <div class="modal">
            <div class="content">
                <div class="title">
                    Info
                </div>
                <form>
                    <p>Pomorodo Clock with 2 modes and notifications.</p>
                    <p>Follow the project on <a href="https://github.com/l-yc/miniweb-eyes">github</a>!</p>

                    <div class="row submit">
                        <input type="button" value="Ok">
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('do-restart').onclick = () => {
        init();
    };

    document.getElementById('toggle-work').onclick = () => {
        setMode(new Date().getTime(), 0);
    };

    document.getElementById('toggle-break').onclick = () => {
        setMode(new Date().getTime(), 1);
    };

    document.getElementById('show-settings').onclick = () => {
        let modal = document.createElement('div');
        modal.innerHTML = settingsModal;

        let workTime = modal.querySelector('input[name="workTime"]');
        let breakTime = modal.querySelector('input[name="breakTime"]');
        let playSound = modal.querySelector('input[name="playSound"]');
        workTime.value = lim[0];
        breakTime.value = lim[1];
	playSound.checked = isSoundOn;

        modal.querySelector('input[value="Ok"]').addEventListener('click', () => {
            lim[0] = workTime.value;
            lim[1] = breakTime.value;
	    isSoundOn = playSound.checked;
            document.body.removeChild(modal);
            setMode(new Date().getTime(), 0);
        });

        modal.querySelector('input[value="Cancel"]').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    };

    document.getElementById('show-info').onclick = () => {
        let modal = document.createElement('div');
        modal.innerHTML = infoModal;
        modal.querySelector('input[value="Ok"]').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        document.body.appendChild(modal);
    };
});

