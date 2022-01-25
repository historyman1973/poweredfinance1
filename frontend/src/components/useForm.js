import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';

export function useForm(initialFValues) {

    const [values, setValues] = useState(initialFValues);

    const handleInputChange = e => {
        const {name, value} = e.target
        setValues({
          ...values,
          [name] : value
        })
      }
    
    return {
        values,
        setValues,
        handleInputChange
    }

}

const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiFormControl-root': {
        width: '40%',
        margin: '10px'
      }
    }
  }))



export function Form(props) {

    const classes = useStyles();

    return (
        <form className={classes.root}>
            {props.children}
        </form>
    )

}

