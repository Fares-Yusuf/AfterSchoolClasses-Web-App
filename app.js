// Custom sorting function
function customSortedList(originalList, sortProperty, isAscending) {
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
      return valueB - valueA;
    }
  }

  // Implementing a simple sorting algorithm (e.g., bubble sort)
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
            [originalList[j], originalList[j + 1]] = [next, current];
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
            [originalList[j], originalList[j + 1]] = [next, current];
          }
          break;
        case "Price":
          // Convert prices to numeric values for numerical comparison
          if (
            compareNumbers(parseFloat(current.Price), parseFloat(next.Price)) >
            0
          ) {
            [originalList[j], originalList[j + 1]] = [next, current];
          }
          break;
        case "Space":
          // Convert quantities to numeric values for numerical comparison
          if (
            compareNumbers(
              parseFloat(current.Quantity),
              parseFloat(next.Quantity)
            ) > 0
          ) {
            [originalList[j], originalList[j + 1]] = [next, current];
          }
          break;
        default:
          // Default to no sorting if an invalid property is provided
          break;
      }
    }
  }
  // Return the sorted list
  return originalList.slice();
}

// Initialize item count for the cart
let itemCount = 0;

// Vue instance for managing classes and cart functionality
var Classes = new Vue({
  el: "#Classes",
  data: {
    // Toggle for displaying/hiding classes
    showClasses: true,

    // Site name
    SiteName: "After School Club",

    // Search input text
    searchText: "",

    // Disable cart button if cart is empty
    disabled: true,

    // Displayed cart count
    Cart: "Cart: " + itemCount,

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
        this.cartArray = this.cartArray.filter((cartItem) => cartItem !== item);
      }

      // Update cart count
      this.Cart = "Cart: " + itemCount;
    },
  },
  computed: {
    // Filter and sort the classesArray based on search and sort criteria
    filteredList: function () {
      // Extract values from classesArray for filtering
      let originalList = Object.values(this.classesArray);

      // Filter the original list based on the search text
      const filtered = originalList.filter((item) => {
        return (
          /* I don't like includes because it doesn't make sense for searching. No one searches for paris by typing ris without the pa */
          item.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.Location.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.Price.toString().startsWith(this.searchText.toLowerCase())

          //   item.title.toLowerCase().startsWith(this.searchText.toLowerCase()) ||
          //   item.Location.toLowerCase().startsWith(this.searchText.toLowerCase()) ||
          //   item.Price.toString().startsWith(this.searchText.toLowerCase())
        );
      });

      // Return the filtered (and possibly sorted) list using customSortedList function
      if (this.sortCriteria) {
        const [sortProperty, sortOrder] = this.sortCriteria.split("_");
        const isAscending = sortOrder === "asc";

        return customSortedList(filtered, sortProperty, isAscending);
      }

      // Return the filtered list without sorting
      return filtered;
    },
  },
  created: async function () {
    // Fetch classesArray data from Lessons.json
    try {
      const response = await fetch("Lessons.json");
      const data = await response.json();
      this.classesArray = data;
    } catch (error) {
      console.error("Error fetching data from Lessons.json", error);
    }
  },
});
