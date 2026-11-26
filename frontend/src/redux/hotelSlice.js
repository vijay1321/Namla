import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hotels: [],
};

const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
    },
    addHotel: (state, action) => {
      state.hotels.unshift(action.payload);
    },
    deleteHotel: (state, action) => {
      state.hotels = state.hotels.filter(
        (hotel) => hotel.id !== action.payload
      );
    },
    updateHotel: (state, action) => {
      const updatedHotel = action.payload;
      state.hotels = state.hotels.map((hotel) =>
        hotel.id === updatedHotel.id ? updatedHotel : hotel
      );
    },
  },
});

export const { setHotels, addHotel, deleteHotel, updateHotel } =
  hotelSlice.actions;

export default hotelSlice.reducer;
