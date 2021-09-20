function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

const settingsModal = `
  <div class="modal">
    <div class="content">
      <div class="title">
        Settings
      </div>
      <form>
        <div class="row">
          <input type="checkbox" name="APA-Citation">
          <label for="APA-Citation">Ignore APA Citations</label>
        </div>

        <div class="row submit">
          <input type="button" value="Ok">
          <input type="button" value="Cancel">
        </div>
      </form>
    </div>
  </div>
`;

let ignoreList = [];

docReady(() => {
  const input = document.querySelector("#input");
  const wordCount = document.querySelector("#word-count");

  const recalc = () => {
    let raw = input.value.trim();
    ignoreList.forEach(x => { raw = raw.replace(x, ''); });
    const tokens = raw.split(/\s/).filter(x => x.length);
    //console.log(tokens);
    wordCount.innerText = tokens.length;
  }

  input.oninput = (e) => recalc();

  recalc();

  document.getElementById('show-settings').onclick = () => {
    let modal = document.createElement('div');
    modal.innerHTML = settingsModal;

    let apaCitation = modal.querySelector('input[name="APA-Citation"]');
    const apaRegex = /\((([A-z]+)(, [A-z]+)*( & [A-z]+)? [0-9]{4})(; ([A-z]+)(, [A-z]+)*( & [A-z]+)? [0-9]{4})*\)/g;
    apaCitation.checked = ignoreList.indexOf(apaRegex) != -1;

    modal.querySelector('input[value="Ok"]').addEventListener('click', () => {
      const idx = ignoreList.indexOf(apaRegex);
      if (apaCitation.checked) {
        if (idx === -1) ignoreList.push(apaRegex);
      } else {
        if (idx !== -1) ignoreList.splice(idx, 1);
      }

      document.body.removeChild(modal);
      recalc();
    });

    modal.querySelector('input[value="Cancel"]').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    document.body.appendChild(modal);
  };
});

