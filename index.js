const axios = require("axios").default;
const { parseHTML } = require("linkedom");

class FileExtensionData {
  constructor() {}

  async extension(extension) {
    let { data: html } = await axios.get(
      `https://file.org/extension/${extension.replace(/\./g, "")}`
    );

    if (!this.exist(html))
      throw new Error(`This Extension File Is Not Supported Try Another One.`);
    let doc = parseHTML(html).window.document;

    let PCardData = Array.from(
      doc.querySelector(".card-body").querySelectorAll("p")
    ).map((e) => e.textContent);

    let whatIsExtension =
      PCardData[1] + "\n" + PCardData[2]

    let HowToOpenExtension = PCardData[5] ? PCardData[4] : PCardData[3];

    let apps = Array.from(doc.querySelectorAll(".card-body")).reverse()[0];

    let allApps = [...Array.from(doc.querySelectorAll("table.table[data-page=1] tr")).map(
      (e) => e.textContent.replace(/User submitted/g, "")
    ),...Array.from(doc.querySelectorAll("table.table[data-page=2] tr")).map(
        (e) => e.textContent.replace(/User submitted/g, "")
      )]

    return {
        what_is: whatIsExtension,
        how_to_use: HowToOpenExtension,
        common_apps_for: allApps
    }
  }

  /**
   *
   * @param {String} html
   * @returns {Boolean}
   */
  exist(html) {
    let unknown = html.includes(
      `We have not yet verified any programs for Windows that work with this specific file format. If you know one, please use the 'Suggest a program' link below. Thanks!`
    );
    if (unknown) return false;
    else return true;
  }
}

