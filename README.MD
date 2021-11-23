# GratiBox

An easy way of signig up to a life of everyday gratefulness.

<p  align='center'>
<img src="./assets/gratibox_front_page.png"/>
</p>

</br>
Try it out now at https://gratibox-front-eight.vercel.app/

## About

This is the back-end of a web application on which people can sign up to a delivery service that provides them with products such as incence, organics and tea. A few of the implemented features:

- Sign Up;
- Login;
- Register a user sinature and delivery address;
- Return the plna information and the next three delivery dates for the choosen plan;

# Future features

- Automatic address form filling through the user's CEP.
- Avaliation form on which the user can tell how he is feeling about the last deliveries

## Technologies

The following tools and frameworks were used in the construction of the project:<br>

<p>
<img style='margin: 5px;' src='https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white'>
<img style='margin: 5px;' src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
<img style='margin: 5px;' src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
<img style='margin: 5px;' src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img style='margin: 5px;' src='https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white'>
<img style='margin: 5px;' src='https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white'>
<img style='margin: 5px;' src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
<img style='margin: 5px;' src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E"/>
<img style='margin: 5px;' src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white
"/>

</p>

## How to run

1. Clone this repository
2. Clone the front-end repository at https://github.com/leoguzi/gratibox-front
3. Follow instructions to run front-end at https://github.com/leoguzi/gratibox-front
4. Install dependencies

```bash
npm i
```

5. Create the database using the provided sql file. (the database name must be 'gratibox_dev')

6. Configure the enviroment variables using the .env.example file.

7. Run the back-end on development mode with:

```bash
npm run dev
```

9. Finally the API is up and ready to receive requests at http://localhost:4000

10. You can alternatively access the API directly on https://gratiboxleo.herokuapp.com/

# Another information

The production environment (npm start) is configured for the heroku deployment. If you wish to run in production locally you must edit the database.js file to point to a valid .env with the info listed at the .env.exemple.
