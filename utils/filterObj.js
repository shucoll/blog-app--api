//Function to filter out only the fields that can be updated by the user. Utility function for updateMe(), updateUser()
export default (obj, ...allowedFields) => {
  const newObj = {};

  //looping through the object's keys and checking if there are the keys same as the elements in the allowedFields. Object.keys() returns an array of all the object's keys and then we loop through them using the forEach() and see if those key elements are included in the allowedFields, if they are we add them to the newObject which is the object with valid keys and data, and is used to update the user's data in the document.
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
