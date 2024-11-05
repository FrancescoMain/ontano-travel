export const fetchPorts = async () => {
  try {
    const response = await fetch(
      "http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/tour/port"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching ports:", error);
    throw error;
  }
};

export const fetchTours = async () => {
  try {
    const response = await fetch(
      "http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/tour"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};
