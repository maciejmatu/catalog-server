
# Catalog Project REST Api #




  #### This is documentation of the REST Api designed for Catalog project. ####















<br>


## Register Route ##


  #### Registers new user ####



* **URL**

  
    `/auth/register`
  



* **Method:**

  
    `POST`
  





- **Data Params**

  
    `email`
  
    `password`
  
    `age`
  
    `displayName`
  



- **Success Response:**

  
    - **Code:** 200<br>**Content:**
      ```
        {
            token, user {
                _id, displayName, email, role
            }
        }
      ```
  



- **Error Response:**

  
    * **Code:** 422<br>**Content:**
      `{error}`
  



- **Sample Call:**

  ```javascript
    $.ajax({
        url: '/auth/register',
        dataType: 'json',
        data: {
            email: 'example@mail.com',
            password: 'kitty123',
            age: 20,
            displayName: 'sampleman'
        },
        type: 'POST',
        success: function (res) {}
    });
  ```

<br>


## Login Route ##


  #### Logins new user ####



* **URL**

  
    `/auth/login`
  



* **Method:**

  
    `POST`
  





- **Data Params**

  
    `email - user email`
  
    `password - user password`
  



- **Success Response:**

  
    - **Code:** 201<br>**Content:**
      ```
        {
            token: 'JWT sometoken',
            user: userObject
        }
      ```
  





- **Sample Call:**

  ```javascript
    $.ajax({
        url: '/auth/login',
        dataType: 'json',
        data: {
            email: 'example@email.com',
            password: 'kitty123'
        }
    })
  ```

<br>