import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { addproduct } from '../apicall/apicall';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <a color="inherit" href="https://mui.com/">
                CRUD website
            </a>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

const Index = () => {

    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]); // Multiple images

    const onSubmit = async (data, e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("p_name", data.p_name);
        formData.append("p_size", size);
        formData.append("p_color", color);
        formData.append("category", data.category);
        formData.append("price", data.price);
        formData.append("p_description", data.p_description);
        images.forEach((image) => formData.append("image", image)); // Append multiple images
        try {
            const response = await addproduct(formData);
            if (response?.status === 201) {
                reset();
                setImages([]);
                setSize([]);
                setColor([]);
                setLoading(false);
                router.push('/product')
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            setLoading(false)
        }
    }

    const handleSize = (e) => {
        const value = e.target.value;
        setSize(e.target.checked ? [...size, value] : size.filter((item) => item !== value));
    };

    const handleColor = (e) => {
        const value = e.target.value;
        setColor(e.target.checked ? [...color, value] : color.filter((item) => item !== value));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
    };


    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 10,
                            padding: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 2,
                            backgroundColor: 'white',
                            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.12)'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <EditIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                            Create Product
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3, width: '100%' }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="p_name"
                                        required
                                        fullWidth
                                        label="Product Name"
                                        autoFocus
                                        {...register("p_name")}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Product Size
                                    </Typography>
                                    <div onChange={handleSize}>
                                        {['s', 'm', 'xl', 'xxl'].map((label) => (
                                            <label key={label} style={{ display: 'block', margin: '5px 0' }}>
                                                <input
                                                    type="checkbox"
                                                    value={label}
                                                    checked={size.includes(label)}
                                                /> {label}
                                            </label>
                                        ))}
                                    </div>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Product Color
                                    </Typography>
                                    <div onChange={handleColor}>
                                        {['white', 'purple', 'blue', 'black'].map((label) => (
                                            <label key={label} style={{ display: 'block', margin: '5px 0' }}>
                                                <input
                                                    type="checkbox"
                                                    value={label}
                                                    checked={color.includes(label)}
                                                /> {label}
                                            </label>
                                        ))}
                                    </div>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Upload Images
                                    </Typography>
                                    <input
                                        type="file"
                                        onChange={handleImages}
                                        multiple
                                        name="image"
                                        accept="image/*"
                                    />
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
                                        {images.map((image, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    position: 'relative',
                                                    width: 80,
                                                    height: 80,
                                                    marginRight: 2,
                                                    marginBottom: 2
                                                }}
                                            >
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="preview"
                                                    style={{ width: '100%', height: '100%', borderRadius: 5 }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeImage(index)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            label="Category"
                                            {...register("category")}
                                        >
                                            <MenuItem value="fashion">Fashion</MenuItem>
                                            <MenuItem value="electronics">Electronics</MenuItem>
                                            <MenuItem value="food">Food</MenuItem>
                                            <MenuItem value="grocery">Grocery</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="price"
                                        required
                                        fullWidth
                                        label="Price"
                                        type="number"
                                        {...register("price")}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="p_description"
                                        required
                                        fullWidth
                                        label="Product Description"
                                        {...register("p_description")}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 4, mb: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Create Product"}
                            </Button>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 5 }} />
                </Container>
            </ThemeProvider>
        </>
    );
};

export default Index;
