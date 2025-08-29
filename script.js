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

// Create custom dropdown with search + Enter support
function createCustomDropdown(containerId, currencies, defaultValue, onChange) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear old dropdown

  const selected = document.createElement("div");
  selected.className = "selected";

  const optionsDiv = document.createElement("div");
  optionsDiv.className = "options";

  // 🔎 Search input
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search currency...";
  searchInput.className = "search-box";
  optionsDiv.appendChild(searchInput);

  // Render options function
  function renderOptions(filterText = "") {
    optionsDiv.querySelectorAll(".option").forEach(opt => opt.remove());

    currencies
      .filter(currency => currency.toLowerCase().includes(filterText.toLowerCase()))
      .forEach(currency => {
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
          setSelected(currency, img.src);
        });

        optionsDiv.appendChild(option);

        // Default selection
        if (currency === defaultValue) {
          setSelected(currency, img.src);
        }
      });
  }

  // Helper to set selected value
  function setSelected(currency, imgSrc) {
    selected.innerHTML = "";
    if (imgSrc) {
      const newImg = document.createElement("img");
      newImg.src = imgSrc;
      selected.appendChild(newImg);
    }
    selected.appendChild(document.createTextNode(currency));
    optionsDiv.style.display = "none";
    onChange(currency);
  }

  // Filter while typing + Enter key select
  searchInput.addEventListener("keyup", (e) => {
    const filter = e.target.value;
    renderOptions(filter);

    // If user presses Enter, auto select first match
    if (e.key === "Enter") {
      const firstMatch = currencies.find(c =>
        c.toLowerCase().includes(filter.toLowerCase())
      );
      if (firstMatch) {
        const countryCode = currencyToCountry[firstMatch];
        const imgSrc = countryCode ? `https://flagcdn.com/48x36/${countryCode}.png` : "";
        setSelected(firstMatch, imgSrc);
      }
    }
  });

  renderOptions();

  selected.addEventListener("click", () => {
    optionsDiv.style.display = optionsDiv.style.display === "block" ? "none" : "block";
    searchInput.focus();
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

// 🔄 Swap currencies on arrow click
document.querySelector(".arrow").addEventListener("click", () => {
  [fromCurrency, toCurrency] = [toCurrency, fromCurrency];

  // Reload dropdowns with swapped defaults
  loadCurrencies();

  // Auto-convert instantly after swap
  convertCurrency();
});

// Initial load
loadCurrencies();
