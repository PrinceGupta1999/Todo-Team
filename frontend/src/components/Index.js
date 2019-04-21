import React from 'react'
import { Grid } from '@material-ui/core';

function Index(props) {
    return (
        <Grid container>
            <Grid item sm>
                Left Pane
            </Grid>
            <Grid item sm>
                Right Pane
            </Grid>
        </Grid>
    );
}

export default Index;
