exports.handler = async (event) => {
  console.log('TEST FUNCTION CALLED');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Test function works!" })
  };
};
