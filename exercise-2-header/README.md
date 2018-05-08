Exercise 2: Header
==================
In this exercise we will build the header of our trade blotter. We will use Material-UI to style the header exactly as shown below. None of the controls will function yet. We will get them working in subsequent exercises. For now, we will only focus on styling.

![Domain Model](../assets/mini-blotter.png)

Exercise
--------
We will start with an off-the-shelf starter project that uses our preferred technology stack. We will continue to build upon this project in the following exercises until the entire blotter is working.

Clone the starter project from [react-mobx-mui-ts-monorepo](https://github.com/nareshbhatia/react-mobx-mui-ts-monorepo). Rename your local copy as `trader-desktop`. The starter project contains two packages:
- `shared` is expected to contain reusable code such as domain objects, stores and UI components.
- `myapp` is expected to contain the final app. It is responsible for composing the components in `shared` into pages and providing routing functionality to navigate between them. The pages will use stores created in `shared` to pull in data from the server.

There are three README.md files in the monorepo. Use the instructions in these files to build the shared library and the main app. Get intimately familiar with all the commands described in these files - these will help you with your blotter implementation going forward.

The `shared` folder already contains a starter implementation of the header component. We will enhance it step-by-step to make it look like the one in the design above. Use Storybook to build the header as a standalone component. Don't rush to test it in the main app yet. Follow the steps below to implement the header:

- While we will use CSS-in-JS to encapsulate our styles inside our components, we still have to set some global defaults, e.g. the background color of our app, the default font color etc. For now, we will have to set these global defaults for Storybook. Later we will do the same for the main app. The global css for Storybook is saved in `shared/.storybook/preview-head.html`. Adjust the background color and text color to match the design.
- Edit `shared/src/components/test-support/get-test-theme.ts`. Set the background color of the theme to match the design. Refer to [Material-UI docs](https://material-ui-next.com/customization/default-theme/) to find out where the default background color is set. (Hint: look under palette).
- Edit `header.tsx` to inject styles using the withStyles HOC. Refer to the [Material-UI docs](https://material-ui-next.com/guides/typescript/) to understand how to do this with TypeScript. Here's a quick start showing how to do this for the toolbar height and title:

```typescript jsx
import * as React from 'react';

import AppBar from 'material-ui/AppBar';
import {
    StyledComponentProps,
    WithStyles,
    withStyles
} from 'material-ui/styles';
import { Theme } from 'material-ui/styles/createMuiTheme';
import Toolbar from 'material-ui/Toolbar';

const styles = (theme: Theme) => ({
    toolbar: {
        minHeight: 50
    },
    title: {
        color: theme.palette.grey[300],
        fontSize: 13,
        fontWeight: theme.typography.fontWeightMedium,
        flex: 1
    }
});

const decorate = withStyles(styles);

export interface HeaderProps {
    children?: any;
}

export const Header = decorate(
    class extends React.Component<
        HeaderProps &
            WithStyles<'toolbar' | 'title'>
    > {
        render() {
            const { classes, children } = this.props;

            return (
                <AppBar position="static" elevation={0} color="default">
                    <Toolbar className={classes.toolbar}>
                        <h1 className={classes.title}>{children}</h1>
                    </Toolbar>
                </AppBar>
            );
        }
    }
);
```

- Now add the visibility selector radio buttons (All, Open & Done). Add them as a new component called `VisibilitySelector` in a separate file `visibility-selector.tsx`. Refer to the [Radio Buttons](https://material-ui-next.com/demos/selection-controls/#radio-buttons) documentation for this.
- Next add the Reset button.
- Next add the new orders input and the New Orders button. Create a separate component for them - `NewOrders` in a file called `new-orders.tsx`.
- Finally add the number of orders indicator to the header.

Once you have fully styled your header, take a look at it in your application. To do this, build the `shared` library (`yarn build`) and then rebuild the app (`cd ../myapp; yarn start`).

Tips
----

Questions
---------

Resources
---------
- [CSS in JS](http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html) - This is the talk by Facebook's Christopher Chedeau that started the CSS-in-JS movement. Look at the speaker deck first and then watch the video. 
- [Material-UI](https://material-ui-next.com/) - Material-UI is an implementation of Google's popular design system called [Material Design](https://material.io/guidelines/). Although our trade blotter does not follow Material Design, using Material-UI is still beneficial for its robust CSS-in-JS implementation.
- [Lerna](https://github.com/lerna/lerna)
- [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
