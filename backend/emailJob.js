const emailjs = require('emailjs-com');
const schedule = require('node-schedule');

// List of emails
const emailList = [
  "liamdearolph@gmail.com",
  "elizhofh@gmail.com",
  // add more emails
];

// Schedule job at 10:00 AM daily
schedule.scheduleJob('35 17 * * *', () => {
  emailList.forEach(email => {
    emailjs.send("service_pox5x5q", "template_eqwmgm9", {
      email: email,
    }, "YOUR_USER_ID") // Replace with your EmailJS user ID or public key
    .then((response) => {
      console.log('Email sent to ${email}', response.status);
    })
    .catch((err) => {
      console.error('Failed to send to ${email}', err);
    });
  });
});