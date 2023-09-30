'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP //

// Data

const account1 = {
  owner: 'Herra Orakzai',
  movements: [5000, 3400, -150, -790, 3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1111,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'QAR',
  locale: 'ar-QA',
};

const account2 = {
  owner: 'ZAIB Orakzai',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-12T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-09-10T14:43:26.374Z',
    '2023-09-02T18:49:59.371Z',
    '2022-07-07T12:01:20.894Z',
  ],
  currency: 'pkr',
  locale: 'ur-pk',
};

const account3 = {
  owner: 'Rashid Orakzai',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 3333,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-12T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-09-10T14:43:26.374Z',
    '2023-09-02T18:49:59.371Z',
    '2022-07-07T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account4 = {
  owner: 'Usama Orakzai',
  movements: [430, 1000, 700, 50, 90, -1000],
  interestRate: 1.6,
  pin: 4444,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-12T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-09-10T14:43:26.374Z',
    '2023-09-02T18:49:59.371Z',
    '2022-07-07T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formateMovementDate = function (date, locale) {
  const clacDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = clacDayPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formateMovementDate(date, acc.locale);

    const formatedMov = formatCurr(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatedMov} </div>
  </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const clacDisplayBalnce = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency);
};
const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((mov, i, arr) => {
      // console.log(arr);
      return mov >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
};

const creatUserName = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUserName(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  //Display balnce
  clacDisplayBalnce(acc);
  //Display Summery
  calcDisplaySummery(acc);
};

let currentAcount, timer;

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // 1n each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Welcome to Orakzai Family Bank App `;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  //decrese 1 sec
  //set time to 5 min
  let time = 300;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
// FAKE ALWAYS LOGED IN

// currentAcount = account1;
// updateUI(currentAcount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAcount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAcount?.pin === +inputLoginPin.value) {
    //Display UI and message
    labelWelcome.textContent = `Welcome Back ${
      currentAcount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Hide the login container
    const loginContainer = document.querySelector('.show-container-first');
    loginContainer.style.display = 'none';
    //Expirement API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long'
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAcount.locale,
      options
    ).format(now);
    // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;
    //Clear the input data
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //Display Movements And UpdateUI

    updateUI(currentAcount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    currentAcount.balance >= amount &&
    recieverAcc?.userName !== currentAcount.userName
  ) {
    //Doing the transfer
    currentAcount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    //Add transfer Date
    currentAcount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    //Display Movements And UpdateUI
    updateUI(currentAcount);

    //Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAcount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      //Add movements
      currentAcount.movements.push(amount);
      //Add current Date
      currentAcount.movementsDates.push(new Date().toISOString());
      //upDateUi
      updateUI(currentAcount);
      //Reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAcount.userName === inputCloseUsername.value &&
    currentAcount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAcount.userName
    );
    console.log(index);
    //Delete accounts
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Refresh the Page get Started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputLoginPin.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcount, sorted);
  sorted = !sorted;
});
