//-- Prolog Session
import subway_program from './subway-prolog.js'
const session = pl.create()
session.consult(subway_program)

//-- Constants and Variables
const user_avatar = 'https://image.flaticon.com/icons/svg/1400/1400241.svg'
const subway_avatar = 'https://image.flaticon.com/icons/svg/1995/1995600.svg'
const messages = {
  greetings: `Hello! 😁
  <br/>
  Welcome To Subway! 🥖
  <br/>
  <br/>
  Please choose your meal type! 
  <br/>
  <br/>
  👉🏼 Healthy
  <br/>
  👉🏼 Normal
  <br/>
  👉🏼 Value
  <br/>
  👉🏼 Vegan
  <br/>
  👉🏼 Veggie
  `,
  bread_choices: `
  <br/>
  <br/>
  What about your bread?
  <br/>
  <br/>
  🥖 Flatbread
  <br/>
  🥖 Honey_Oat
  <br/>
  🥖 Italian
  <br/>
  🥖 Hearthy_Italian
  <br/>
  🥖 Wheat
  `,
  meat_choices: `
  <br/>
  <br/>
  Meat meat? One meat
  <br/>
  <br/>
  🐔 Chicken
  <br/>
  🥩 Beef
  <br/>
  🍖 Ham
  <br/>
  🥓 Bacon
  <br/>
  🐟 Salmon
  <br/>
  🐠 Tuna
  <br/>
  🐓 Turkey
  `,
  veggie_choices: `
  <br/>
  <br/>
  Time for some greens! 🥗 One for now
  <br/>
  <br/>
  🥒 Cucumber
  <br/>
  🍃 Green_Peppers
  <br/>
  🥬 Lettuce
  <br/>
  🔴 Red_Onions
  <br/>
  🍎 Tomatoes
  `,
  all_sauce_choices: `
  <br/>
  <br/>
  Choose one of our tasty sauces 💦
  <br/>
  <br/>
  💦 Chipotle
  <br/>
  💦 BBQ
  <br/>
  💦 Ranch
  <br/>
  💦 Sweet_Chilli
  <br/>
  💦 Mayo
  <br/>
  💦 Honey_Mustard
  <br/>
  💦 Sweet_Onion
  `,
  non_fat_sauce_choices: `
  <br/>
  <br/>
  Chose one of our fat-free sauces 💦
  <br/>
  <br/>
  💦 Honey_Mustard
  <br/>
  💦 Sweet_Onion
  `,
  all_top_up_choices: `
  <br/>
  <br/>
  One of top-ups 🔝
  <br/>
  <br/>
  🧀 American
  <br/>
  🧀 Monterey_Jack
  <br/>
  🧀 Cheddar
  <br/>
  🥑 Avocado
  <br/>
  🥚 Egg_mayo
  `,
  non_cheese_topup_choices: `
  <br/>
  <br/>
  One of cheese free top-ups 🔝
  <br/>
  <br/>
  🥑 Avocado
  <br/>
  🥚 Egg_mayo
  `,
  side_choices: `
  <br/>
  <br/>
  Finally, choose one side
  <br/>
  <br/>
  🥔 Chips
  <br/>
  🍪 Cookies
  <br/>
  🥤 Drinks
  `
}
const user_order = {}
const steps = [
  'meals',
  'breads',
  'meats',
  'veggies',
  'sauces',
  'topups',
  'sides',
  'end'
]
let progress = 0
//-- END Constants and Variables

//-- Helper Functions
const formatAMPM = date => {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  let strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

const insertChat = (who, text) => {
  let date = formatAMPM(new Date())
  let chatLoadingHTML =
    '<li style="width:100%;">' +
    '<div class="msj macro">' +
    '<div class="avatar"><img class="img-square" style="width:100%;" src="' +
    subway_avatar +
    '" /></div>' +
    '<div class="text text-l">' +
    '<p>' +
    '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>' +
    '</p>' +
    '</div>' +
    '</li>'
  let replyHTML = ''

  if (who == 'subway') {
    replyHTML =
      '<li style="width:100%;">' +
      '<div class="msj macro">' +
      '<div class="avatar"><img class="img-square" style="width:100%;" src="' +
      subway_avatar +
      '" /></div>' +
      '<div class="text text-l">' +
      '<p>' +
      text +
      '</p>' +
      '<p><small>' +
      date +
      '</small></p>' +
      '</div>' +
      '</div>' +
      '</li>'

    $('ul')
      .append(chatLoadingHTML)
      .scrollTop($('ul').prop('scrollHeight'))

    setTimeout(() => {
      $('ul li:last-child').remove()
      $('ul')
        .append(replyHTML)
        .scrollTop($('ul').prop('scrollHeight'))
    }, 700)
  } else {
    replyHTML =
      '<li style="width:100%;">' +
      '<div class="msj-rta macro">' +
      '<div class="text text-r">' +
      '<p>' +
      text +
      '</p>' +
      '<p><small>' +
      date +
      '</small></p>' +
      '</div>' +
      '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-square" style="width:100%;" src="' +
      user_avatar +
      '" /></div>' +
      '</li>'

    $('ul')
      .append(replyHTML)
      .scrollTop($('ul').prop('scrollHeight'))
  }
}
//-- END Helper Functions

// -- Add 'Enter' key press event listener to send button
$('.glyphicon').click(() => {
  $('.mytext').trigger({ type: 'keydown', which: 13, keyCode: 13 })
})

// -- Add 'Enter' key press event listener to text input
$('.mytext').on('keydown', function(e) {
  if (e.which == 13) {
    let text = $(this)
      .val()
      .toLowerCase()
    if (text !== '') {
      insertChat('user', text)
      switch (steps[progress]) {
        case 'meals':
          user_order.meal = text.toUpperCase()
          if (user_order.meal == 'VEGAN' || user_order.meal == 'VEGGIE') {
            user_order.meat = '❌ NO MEAT'
          } else if (user_order.meal == 'VALUE') {
            user_order.topup = '❌ NO TOPUP'
          }
          session.query(`asserta(chosen_meals(${text})), show_meals(X).`)
          session.answer(answer => {
            if (pl.type.is_substitution(answer)) {
              insertChat(
                'subway',
                `Going for <b>${user_order.meal}</b> meal alrighty! ${messages.bread_choices}`
              )
            }
            progress = 1
          })
          break
        case 'breads':
          user_order.bread = text.toUpperCase()
          session.query(`asserta(chosen_breads(${text.toLowerCase()})).`)
          session.query(`ask_meats(X).`)
          session.answer(answer => {
            if (pl.type.is_substitution(answer)) {
              let result = answer.lookup('X')
              if (result == '[]') {
                // vegan or vegie
                insertChat(
                  'subway',
                  `🥖 <b>${user_order.bread.toUpperCase()}</b> was just freshly baked by our 👩‍🍳 Since you chose <b>${
                    user_order.meal
                  }</b> meal, no meat options for you. ${
                    messages.veggie_choices
                  }`
                )
                progress = 3
              } else {
                // meat
                insertChat(
                  'subway',
                  `🥖 <b>${user_order.bread.toUpperCase()}</b> was just freshly baked by our 👩‍🍳 ${
                    messages.meat_choices
                  }`
                )
                progress = 2
              }
            }
          })
          break
        case 'meats':
          user_order.meat = text.toUpperCase()
          session.query(`asserta(chosen_meats(${text.toLowerCase()})).`)
          session.query(`ask_veggies(X).`)
          session.answer(answer => {
            if (pl.type.is_substitution(answer)) {
              insertChat(
                'subway',
                `Juicy and tender <b>${user_order.meat}</b>! 😋 ${messages.veggie_choices}`
              )
            }
            progress = 3
          })
          break
        case 'veggies':
          user_order.veggie = text.toUpperCase()
          session.query(`asserta(chosen_veggies(${text.toLowerCase()})).`)
          session.query(`ask_sauces(X).`)
          session.answer(answer => {
            if (pl.type.is_substitution(answer)) {
              let result = answer.lookup('X')
              if (result == '[[honey_mustard, sweet_onion]]') {
                insertChat(
                  'subway',
                  `<b>${user_order.veggie}</b> just arrived today morning from New Zealands! 🛬 and  becuase you chose <b>${user_order.meal}</b> ${messages.non_fat_sauce_choices}`
                )
              } else {
                insertChat(
                  'subway',
                  `<b>${user_order.veggie}</b> just arrived today morning from New Zealands! 🛬 ${messages.all_sauce_choices}</b>`
                )
              }
            }
          })
          progress = 4
          break
        case 'sauces':
          user_order.sauce = text.toUpperCase()
          session.query(`asserta(chosen_sauces(${text.toLowerCase()})).`)
          session.query(`ask_topups(X).`)
          session.answer(answer => {
            if (pl.type.is_substitution(answer)) {
              let result = answer.lookup('X')
              if (result == '[]') {
                insertChat(
                  'subway',
                  `<b>${user_order.sauce}</b> is our crowd favourite <br/> Becuase you chose <b>${user_order.meal}</b> meal, no top-up options for you ${messages.side_choices}`
                )
                progress = 6
              } else if (result == '[[avocado, egg_mayo]]') {
                insertChat(
                  'subway',
                  `<b>${user_order.sauce}</b> is our crowd favourite <br/> Becuase you chose <b>${user_order.meal}</b> meal, no cheese top-up for you ${messages.non_cheese_topup_choices}`
                )
                progress = 5
              } else {
                insertChat(
                  'subway',
                  `<b>${user_order.sauce}</b> is our crowd favourite ${messages.all_top_up_choices}`
                )
                progress = 5
              }
            }
          })
          break
        case 'topups':
          user_order.topup = text.toUpperCase()
          session.query(`asserta(chosen_topups(${text.toLowerCase()})).`)
          session.query(`ask_sides(X).`)
          session.answer(answer => {
            if (pl.type.is_substitution(answer)) {
              insertChat(
                'subway',
                ` <b>${user_order.topup}</b>? Good choice 👍🏻 ${messages.side_choices}`
              )
            }
          })
          progress = 6
          break
        case 'sides':
          user_order.side = text.toUpperCase()
          session.query(`asserta(chosen_sides(${text.toLowerCase()})).`)
          insertChat(
            'subway',
            `Okay! Your order
          <br/>
          <br/>
          Meal 🌯
          <br/>
          <b>${user_order.meal}</b>
          <br/>
          <br/>
          Bread 🥖
          <br/>
          <b>${user_order.bread}</b>
          <br/>
          <br/>
          Meat 🍖
          <br/>
          <b>${user_order.meat}</b>
          <br/>
          <br/>
          Veggie 🥗
          <br/>
          <b>${user_order.veggie}</b>
          <br/>
          <br/>
          Sauce 💦
          <br/>
          <b>${user_order.sauce}</b> 
          <br/>
          <br/>
          Topup 🔝
          <br/>
          <b>${user_order.topup}</b>
          <br/>
          <br/>
          Side 🍴
          <br/>
          <b>${user_order.side}</b>
          <br/>
          <br/>
          is being prepared.Thank you for choosing Subway! 😁
          If you would like to make new order, refresh the page 
          `
          )
          break
        case 'end':
          break
        default:
          break
      }
      $(this).val('')
    }
  }
})

// ---- Print Messages
insertChat('subway', messages.greetings)
