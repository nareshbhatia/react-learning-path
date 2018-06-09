Exercise 6: Order Progress Bar
==============================

Overview
--------
In this final exercise we will implement the order progress bar that goes into the last column of the order list.

Exercise
--------
### Create the OrderProgressBar component
Create the `OrderProgressBar` component in the folder `shared/src/components/order-list`. This component takes an order as a prop and renders its progress as a stacked bar chart. The chart is made up of a horizontal stack of bars. The leftmost bar represents the percentage of the order that is done, the middle represents the percentage that is not done and the rightmost bar represents the percentage that is uncommitted. The total of the three must add up to 100%.

Create the component so that it fills the entire space provided by its container. For example, if the container is 300px x 50px then the chart should occupy the whole space. If the container has some padding, then the chart should occupy the whole container minus the padding.

This component is meant to be very simple - 3 elements stacked side-by-side, widths proportional to their percentages. Don't overthink it! Don't use Material UI components, just build it yourself from scratch.

### Create a Storybook story
Create a file called `order-progress-bar.story.tsx` and in it, create a story to test `OrderProgressBar` standalone. Create several variations, one below the other, to test various states of an order. Make sure buy and sell orders show in appropriate color.

### Add OrderProgressBar to the last column of OrderList
Nothing much to say here! Just make sure that the OrderProgressBar shows up in the OrderList story that you created in the last exercise.

### Test in myapp
All you need to do here is to rebuild the shared package and then start myapp. The order progress bars should show in their full glory, animating as the orders get filled.

A New Beginning
---------------
Congratulations! You are now a React Top Gun! Go celebrate tonight with your friends and family. 
