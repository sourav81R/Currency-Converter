const result = document.getElementById("result");

// Currency → Country code mapping for flags
const currencyToCountry = {
  USD: "us", EUR: "eu", INR: "in", GBP: "gb", JPY: "jp", AUD: "au",
  CAD: "ca", CHF: "ch", CNY: "cn", RUB: "ru", BRL: "br", ZAR: "za",
  MXN: "mx", SGD: "sg", HKD: "hk", KRW: "kr", AED: "ae", ARS: "ar",
  BDT: "bd", CLP: "cl", COP: "co", CZK: "cz", DKK: "dk", EGP: "eg",
  HUF: "hu", IDR: "id", ILS: "il", KWD: "kw", LKR: "lk", MYR: "my",
  NGN: "ng", NOK: "no", NZD: "nz", PHP: "ph", PKR: "pk", PLN: "pl",
  QAR: "qa", RON: "ro", SAR: "sa", SEK: "se", THB: "th", TRY: "tr",
  TWD: "tw", UAH: "ua", VND: "vn", ZWL: "zw"
};

const apiURL = "https://api.exchangerate-api.com/v4/latest/USD";
let fromCurrency = "USD";
let toCurrency = "INR";

// Load currencies into custom dropdowns
async function loadCurrencies() {
  const response = await fetch(apiURL);
  const data = await response.json();
  const currencies = Object.keys(data.rates);

  createCustomDropdown("from-select", currencies, fromCurrency, (val) => {
    fromCurrency = val;
  });
  createCustomDropdown("to-select", currencies, toCurrency, (val) => {
    toCurrency = val;
  });
}

// Create custom dropdown
function createCustomDropdown(containerId, currencies, defaultValue, onChange) {
  const container = document.getElementById(containerId);

  const selected = document.createElement("div");
  selected.className = "selected";

  const optionsDiv = document.createElement("div");
  optionsDiv.className = "options";

  currencies.forEach(currency => {
    const option = document.createElement("div");
    option.className = "option";

    const img = document.createElement("img");
    const countryCode = currencyToCountry[currency];
    img.src = countryCode ? `https://flagcdn.com/48x36/${countryCode}.png` : "";

    const span = document.createElement("span");
    span.textContent = currency;

    option.appendChild(img);
    option.appendChild(span);

    option.addEventListener("click", () => {
      selected.innerHTML = "";
      const newImg = document.createElement("img");
      newImg.src = img.src;
      selected.appendChild(newImg);
      selected.appendChild(document.createTextNode(currency));
      optionsDiv.style.display = "none";
      onChange(currency);
    });

    optionsDiv.appendChild(option);

    // Set default
    if (currency === defaultValue) {
      selected.innerHTML = "";
      const defaultImg = document.createElement("img");
      defaultImg.src = img.src;
      selected.appendChild(defaultImg);
      selected.appendChild(document.createTextNode(currency));
    }
  });

  selected.addEventListener("click", () => {
    optionsDiv.style.display = optionsDiv.style.display === "block" ? "none" : "block";
  });

  container.appendChild(selected);
  container.appendChild(optionsDiv);
}

// Convert currency
async function convertCurrency() {
  let amount = document.getElementById("amount").value;
  if (amount === "" || amount <= 0) {
    result.innerText = "Please enter a valid amount";
    return;
  }

  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  const data = await response.json();

  const rate = data.rates[toCurrency];
  const converted = (amount * rate).toFixed(2);

  result.innerText = `${amount} ${fromCurrency} = ${converted} ${toCurrency}`;
}

loadCurrencies();
