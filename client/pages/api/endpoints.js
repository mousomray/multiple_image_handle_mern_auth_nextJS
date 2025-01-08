export const endpoints = {

    auth: {
        register: "/auth/signup",
        login: "/auth/signin",
    },

    cms: {
        addproduct: "/api/addproduct",
        showproduct: "/api/products",
        showproduct: "/api/products",
        singleproduct: "/api/product",
        editproduct: "/api/updateproduct",
        // deletetodo: "/api/deletetodo",
    },

}

export const myendpoints = [
    endpoints.auth.register, //Index number 0
    endpoints.auth.login, //Index number 1
    endpoints.cms.addproduct, //Index number 2
    endpoints.cms.showproduct, //Index number 3
    endpoints.cms.singleproduct, //Index number 4
    endpoints.cms.editproduct, //Index number 5
]