const mongoose = require('mongoose')
const axios = require('axios').default;
const cities = require('./cities')
const {
    descriptors,
    places
} = require('./seedHelper')
const CoffeeShop = require('../models/coffeeShop')
const User = require('../models/user')

//https://res.cloudinary.com/du7mbtyzp/image/upload/c_fill,h_400,w_400/v1657990612/samples/people/myPhoto_ynxpnd.jpg

const productionURL = 'mongodb+srv://keanlk19:keanlk19@cluster0.efomfqs.mongodb.net/?retryWrites=true&w=majority'
const devURL = 'mongodb://localhost:27017/Coffwok'
mongoose.connect(devURL)
    .then(() => {
        console.log('Connect to database successfully !')
    })
    .catch((err) => {
        console.log('ERROR')
        console.log(err)
    })

async function seedImage() {
    const endPoint = 'https://api.unsplash.com/photos/random'
    const clientID = 'UPESMD76DgUo9Hl9u8Vj7OG4klzO1uADuo5gKgIaZrg'
    try {
        const response = await axios.get(`${endPoint}?query=coffeeshop&client_id=${clientID}`);
        return response.data.urls.small
    } catch (error) {
        console.error(error);
    }
}

const sample = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seeder = async () => {
    await CoffeeShop.deleteMany()
    await User.deleteMany()
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * 1000)
        const newCoffeeShop = new CoffeeShop({
            title: sample(descriptors) + ' ' + sample(places),
            city: cities[randomIndex].city + ' ' + cities[randomIndex].state,
            address: 'Avenue Charles de Gaulle',
            images: await seedImage(),
            description: 'Bonjour, Ambiance tranquille, le bon cafe et tous les merveilleuse personnes occupees !'
        })
        await newCoffeeShop.save()
    }
    // await CoffeeShop.deleteMany()
    // await User.deleteMany()
    // for (let i = 0; i < 10; i++) {
    //     const randomIndex = Math.floor(Math.random() * 1000)
    //     const newUser = new User({
    //         name: 'Nguyen Ke An',
    //         age: 20,
    //         contacts: [
    //             'nkalk192002@gmail.com',
    //             'Ins: Kean_en_frnc02'
    //         ],
    //         images: 'https://res.cloudinary.com/du7mbtyzp/image/upload/c_fill,h_400,w_400/v1657990612/samples/people/myPhoto_ynxpnd.jpg',
    //         dailyTask: [
    //             'Programming',
    //             'Reading',
    //             'French',
    //             'English'
    //         ],
    //         description: 'Hello Im An, i love going to coffee shops to work, learn more skills. I am willing to interact, network with others and help everyone around me'
    //     })
    //     await newUser.save()
    //     const newCoffeeShop = new CoffeeShop({
    //         title: sample(descriptors) + ' ' + sample(places),
    //         city: cities[randomIndex].city + ' ' + cities[randomIndex].state,
    //         address: 'Avenue Charles de Gaulle',
    //         images: await seedImage(),
    //         description: 'Bonjour, Ambiance tranquille, le bon cafe et tous les merveilleuse personnes occupees !'
    //     })
    //     for (let j = 0; j < 17; j++) {
    //         newCoffeeShop.users.push(newUser)
    //     }
    //     await newCoffeeShop.save()
    // }
    // for (let i = 0; i < 50; i++) {
    //     const randomIndex = Math.floor(Math.random() * 1000)
    //     const randomPrice = Math.floor(Math.random() * 20) + 10
    //     const newCamp = new Campground({
    //         title: sample(descriptors) + ' ' + sample(places),
    //         location: cities[randomIndex].city + ' ' + cities[randomIndex].state,
    //         author: '629c641ba36e4ccae3a8e4d1',
    //         images: [{
    //                 url: 'https://res.cloudinary.com/du7mbtyzp/image/upload/v1656327037/YELP_CAMP/dglpnmuzekomtzejsf3q.jpg',
    //                 filename: 'YELP_CAMP/dglpnmuzekomtzejsf3q'
    //             },
    //             {
    //                 url: 'https://res.cloudinary.com/du7mbtyzp/image/upload/v1656327037/YELP_CAMP/cpl8kipxpr9jkdjkxncn.jpg',
    //                 filename: 'YELP_CAMP/cpl8kipxpr9jkdjkxncn'
    //             },
    //             {
    //                 url: 'https://res.cloudinary.com/du7mbtyzp/image/upload/v1656327037/YELP_CAMP/pbtug3rsscypga8q7nii.jpg',
    //                 filename: 'YELP_CAMP/pbtug3rsscypga8q7nii'
    //             },
    //             {
    //                 url: 'https://res.cloudinary.com/du7mbtyzp/image/upload/v1656327038/YELP_CAMP/my4x6lsacwkb4tk8oqk6.jpg',
    //                 filename: 'YELP_CAMP/my4x6lsacwkb4tk8oqk6'
    //             }
    //         ],
    //         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis quod, id beatae unde omnis fugiat exercitationem esse?Quaerat aliquid ipsum expedita fugiat corrupti quasi, quisquam eos in Corporis, atque laudantium",
    //         price: randomPrice
    //     })
    //     await newCamp.save()
    // }
}

seeder()
    .then(() => {
        mongoose.connection.close()
    })