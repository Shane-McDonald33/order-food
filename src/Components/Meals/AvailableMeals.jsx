import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { useEffect, useState } from 'react';

// const DUMMY_MEALS = [
//   {
//     id: 'm1',
//     name: 'Sushi',
//     description: 'Finest fish and veggies',
//     price: 22.99,
//   },
//   {
//     id: 'm2',
//     name: 'Schnitzel',
//     description: 'A german specialty!',
//     price: 16.5,
//   },
//   {
//     id: 'm3',
//     name: 'Barbecue Burger',
//     description: 'American, raw, meaty',
//     price: 12.99,
//   },
//   {
//     id: 'm4',
//     name: 'Green Bowl',
//     description: 'Healthy...and green...',
//     price: 18.99,
//   },
// ];

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);//setting state so that data has a place to go and load
  const [isLoading, setIsLoading] = useState(true);//this state is true becasue in this case data is being loaded upon page load
  const [hasError, setHasError] = useState(null);
  
  useEffect(() => {//setting useEffect bc we want someting to happen on page load
    const fetchMeals = async () => {//making the fetch call into a function so it's easier to work with
      const response = await fetch ('https://react-posting-default-rtdb.firebaseio.com/meals.json');//this syntax handles the promise better, more readable, and sets up following promises to be set as constants
      if (!response.ok) {
        throw new Error('Something Went Wrong');
      };
      const responseData = await response.json();//turning the response data into json for usability
      const loadedData = [];//getting the data ready to be pushed into a self valued array
      for (const key in responseData) {//called a 'for in loop', telling the subsequent data to connect their data location to the key
        loadedData.push ({//pushing the json data into the loadedData const
          id: key,//telling the id paramter to search for a key
          name: responseData[key].name,//name relays to name key
          description: responseData[key].description,//description relays to description key
          price: responseData[key].price//price relays to price key
        });
      };
      setMeals(loadedData);//setMeals state relies on the json data pushed into loadedData
      setIsLoading(false);

    }
      fetchMeals().catch((error) => {//telling the function to execute and since it's in useEffect it only happens on page load
        setIsLoading(false);
        setHasError(error.message)
      });
  },[])//the empty array means we only want useEffect to run upon page load and refresh, it is not dependent on a function
  
  if (isLoading) {//adds a little loading message upon page load
    return <section className={classes.MealsLoading}>
      <p>Loading...</p>
    </section>
  }

  if (hasError) {
    return (<section className={classes.MealsError}>
      <p>{hasError}</p>
    </section>
    )
  }
  
  const mealsList = meals.map((meal) => (//mapping through data, meals is the initial state that we're running the data through so we map through it
    <MealItem
    key={meal.id}
    id={meal.id}
    name={meal.name}
    description={meal.description}
    price={meal.price}
    />
  ))

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;