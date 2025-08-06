export const clickXPath = async (page, xpath) => {
  await page.evaluate((xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    const element = result.singleNodeValue;
    if (element) element.click();
  }, xpath);
};