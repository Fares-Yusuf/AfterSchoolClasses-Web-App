// Initialize item count for the cart
let itemCount = 0;

// Vue instance for managing classes and cart functionality
var Classes = new Vue({
    el: "#Classes",
    data: {
        // Toggle for displaying/hiding classes
        showClasses: true,

        // user info
        userName: "",
        phoneNumber: "",

        // checkout button
        checkoutButton: true,

        // Site name
        SiteName: "After School Club",

        // Search input text
        searchText: "",

        // Disable cart button if cart is empty
        disabled: true,

        // Displayed cart count
        Cart: " Cart: " + itemCount,
        // Array to store items in the cart
        cartArray: [],

        // Sorting criteria for classes
        sortCriteria: "title_asc",

        // Array to store classes data
        classesArray: {},
    },
    methods: {
        // Toggle display of the cart
        showCart: function () {
            this.showClasses = !this.showClasses;
        },
        // Checkout method
        checkout: function () {
            // Empty the cart
            this.cartArray = [];
            // Update cart count and disable the button
            this.Cart = "Cart: 0";
            itemCount = 0;
            this.checkoutButton = true;
            // thank the user for their purchase
            alert(
                "Thank you for your purchase " +
                    this.userName +
                    "! We will contact you on your phone number " +
                    this.phoneNumber +
                    " to confirm your purchase."
            );

            // Clear user info fields
            this.userName = "";
            this.phoneNumber = "";
            if (!this.showClasses) {
                this.disabled = true;
                this.showCart();
            }
        },

        // Add an item to the cart
        addToCart: function (item) {
            // Decrease quantity and update cart count
            item.Quantity--;
            itemCount++;
            this.Cart = "Cart: " + itemCount;
            this.disabled = false;
            let index = this.cartArray.indexOf(item);

            // Remove item from cart if already present
            if (this.cartArray.includes(item)) {
                this.cartArray.splice(index, 1);
            }

            // Add the item to the cartArray at the same index
            this.cartArray.splice(index, 0, item);
        },

        // Remove an item from the cart
        removeCart: function (item) {
            // Increase quantity and update cart count
            item.Quantity++;
            itemCount--;

            // Disable cart button if cart is empty and showClasses is true
            if (itemCount == 0) {
                this.disabled = true;
                if (!this.showClasses) {
                    this.showCart();
                }
            }

            // Remove item from cartArray if quantity is zero
            if (item.Quantity == 5) {
                this.cartArray = this.cartArray.filter(
                    (cartItem) => cartItem !== item
                );
            }

            // Update cart count
            this.Cart = "Cart: " + itemCount;
        },
    },
    computed: {
        //Function for checkout validation
        userInfoValidation() {
            // pattern for names min 2 letters and only letters and spaces allowed
            const userNamePattern = /^[a-zA-Z]{2,}[a-zA-Z\s]*$/;

            // UK pattern for phone numbers
            const phoneNumberPattern =
                /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
            const isUserNameValid = userNamePattern.test(this.userName);
            const isPhoneNumberValid = phoneNumberPattern.test(
                this.phoneNumber
            );
            return !(isUserNameValid && isPhoneNumberValid);
        },
        filteredList: function () {
            // Extract values from classesArray for filtering
            let originalList = Object.values(this.classesArray);

            // Filter the original list based on the search text using an Arrow function
            const filteredClasses = mySearch(originalList, (item) => {
                return (
                    item.title
                        .toLowerCase()
                        .includes(this.searchText.toLowerCase()) ||
                    item.Location.toLowerCase().includes(
                        this.searchText.toLowerCase()
                    ) ||
                    item.Price.toString().startsWith(
                        this.searchText.toLowerCase()
                    )
                );
            });

            // Return the filteredClasses (and possibly sorted) list using mySort function
            if (this.sortCriteria) {
                const [sortProperty, sortOrder] = this.sortCriteria.split("_");
                const isAscending = sortOrder === "asc";

                return mySort(filteredClasses, sortProperty, isAscending);
            }

            // Return the filteredClasses list without sorting
            return filteredClasses;
        },
    },
    created: async function () {
        // Fetch classesArray data from the new API endpoint
        try {
            const response = await fetch("http://localhost:3000/lessons");
            const data = await response.json();
            this.classesArray = data;
        } catch (error) {
            console.error("Error fetching data from the API", error);
        }
    },
});

/*

~My custom sorting and searching functions~

*/

// Custom sorting function
function mySort(originalList, sortProperty, isAscending) {
    // Helper function to handle string comparisons
    function compareStrings(valueA, valueB) {
        // Use localeCompare for string comparison in alphabetical order
        // If isAscending is true, return result of ascending string comparison
        // If isAscending is false, return result of descending string comparison
        if (isAscending) {
            return valueA.localeCompare(valueB);
        } else {
            return valueB.localeCompare(valueA);
        }
    }

    // Helper function to handle numeric comparisons
    function compareNumbers(valueA, valueB) {
        // If isAscending is true, return result of ascending numeric comparison
        // If isAscending is false, return result of descending numeric comparison
        if (isAscending) {
            return valueA - valueB;
        } else {
            console.log(valueB - valueA);
            return valueB - valueA;
        }
    }

    // Bubble Sort algorithm
    for (let i = 0; i < originalList.length - 1; i++) {
        for (let j = 0; j < originalList.length - 1 - i; j++) {
            let current = originalList[j];
            let next = originalList[j + 1];

            // Switch between different properties for sorting
            switch (sortProperty) {
                case "title":
                    // Extract lowercase titles for case-insensitive string comparison
                    if (
                        compareStrings(
                            current.title.toLowerCase(),
                            next.title.toLowerCase()
                        ) > 0
                    ) {
                        [originalList[j], originalList[j + 1]] = [
                            next,
                            current,
                        ];
                    }
                    break;
                case "Location":
                    // Extract lowercase locations for case-insensitive string comparison
                    if (
                        compareStrings(
                            current.Location.toLowerCase(),
                            next.Location.toLowerCase()
                        ) > 0
                    ) {
                        [originalList[j], originalList[j + 1]] = [
                            next,
                            current,
                        ];
                    }
                    break;
                case "Price":
                    if (compareNumbers(current.Price, next.Price) > 0) {
                        [originalList[j], originalList[j + 1]] = [
                            next,
                            current,
                        ];
                    }
                    break;
                case "Space":
                    if (compareNumbers(current.Quantity, next.Quantity) > 0) {
                        [originalList[j], originalList[j + 1]] = [
                            next,
                            current,
                        ];
                    }
                    break;
                default:
                    // Default to no sorting if an invalid property is provided
                    break;
            }
        }
    }
    // Return the sorted list
    return originalList;
}

function mySearch(array, callback) {
    let result = [];

    // Iterate over each item in the array
    for (let i = 0; i < array.length; i++) {
        // If the callback function returns true for the item, add it to the result array
        if (callback(array[i])) {
            result.push(array[i]);
        }
    }

    // Return the result array
    return result;
}
