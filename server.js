const express = require('express')
const fs = require("fs")
const path = require('path');

const app = express()
const port = 80

const TelegramBot = require('node-telegram-bot-api'); // подключаем node-telegram-bot-api

const bot = new TelegramBot('6843773214:AAEvSxIdqe2I-Tg1pifdLRlU-rCcy1t80gw', {polling: true});





app.use(express.urlencoded({ extended: true })); 
app.use(express.json());



app.listen(port,() => {
  bot.sendMessage(545741271, 'Привет, сервер запущен');
    console.log(`server started on ${port}`)
})




app.use(express.static(path.join(__dirname, 'build')));






///НОВАЯ ЗАЯВКА 
app.post('/api/data', (req, res) => {

  const currentDate = new Date();
  const options = { timeZone: 'Europe/Moscow' };
  const moscowDate = currentDate.toLocaleString('en-US', options);



    const number = req.body.number;
    const data = req.body.data;
    const name = req.body.name;
   
   const OrdersData = fs.readFileSync('/root/express/orders.txt', 'utf8');
   const OrdersDataArray = JSON.parse("["+OrdersData + "]");
const ids = OrdersDataArray.map(obj=>obj.id)
const LastId = ids.pop()
const NewId = LastId + 1
console.log(LastId)

                const Data = ',' + JSON.stringify({order: data,
                number: number,
                 name: name,
                id: NewId,
                date: moscowDate,
                watched: false,
                called: false,
                inwork: false

                
         } )

console.log(Data)
fs.appendFileSync('/root/express/orders.txt', Data);
console.log('Данные записаны');
bot.sendMessage(545741271, `Новый заказ!\nИмя: ${name}\nНомер: ${number}\nДата: ${moscowDate}\nЗаказ:${data} `);


  
})

////ВХОД В АДМИНКУ

app.post('/api/auth',(req,res) => {

  const password = req.body.password
  console.log(password)
  if (password==='VASKOFRAME'){
    res.send('1')
  }
})


app.get('/api/getorders', (req,res) => {
const OrdersData = fs.readFileSync('/root/express/orders.txt', "utf-8")
const OrdersDataPars = JSON.parse("[" + OrdersData + "]");
console.log(OrdersData)
res.send(OrdersData)

})


app.post('/api/orderactivation', (req,res) => {

const Data = JSON.stringify(req.body)
const newData = Data.slice(1, -1)
console.log(newData)
fs.writeFileSync('/root/express/orders.txt', newData);
console.log('файл обновлен')
})





// ...

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

