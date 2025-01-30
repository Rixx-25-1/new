export const validateUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`http://localhost:3001/user?email=${email}`);
      
      // Check if response is successful
      if (!response.ok) {
        return { success: false, message: "Server error. Please try again." };
      }
  
      const users = await response.json();
      console.log('Users fetched from db.json:', users); //test the response

      const user = users.find((u: any) => u.password === password );
  
      return user
        ? { success: true, user }
        : { success: false, message: "Invalid email or password" };
    } catch (error) {
      return { success: false, message: "Server error. Please try again." };
    }
  };
  