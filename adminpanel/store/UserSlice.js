import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        auth: false
    }
};

export const userSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            const {_id, firstName, lastName, email, auth} = action.payload;

            state.user._id = _id
            state.user.firstName = firstName
            state.user.lastName = lastName
            state.user.email = email
            state.user.auth = auth
        },
        logoutUser: (state) => {
            state.user._id = ""
            state.user.firstName = ""
            state.user.lastName = ""
            state.user.email = ""
            state.user.auth = false
        }
    },
 })

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;