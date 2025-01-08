import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { singleproduct, updateproduct } from '../apicall/apicall';
import { useForm, Controller } from "react-hook-form";
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from "@mui/material";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                CRUD website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

const Index = () => {
    const router = useRouter();
    const { id } = router.query;

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);  // To store selected images


    // Get product For Single Value
    const getProduct = async () => {
        try {
            const response = await singleproduct(id);
            console.log("Single response...", response);

            const reg = {
                p_name: response?.p_name,
                p_size: response?.p_size,
                p_color: response?.p_color,
                image: response?.image,
                category: response?.category,
                price: response?.price,
                p_description: response?.p_description
            };
            reset(reg);
            setSize(response?.p_size);
            setColor(response?.p_color);
            setImages(response?.image); // Load existing images
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const { data: singledata } = useQuery({ queryFn: getProduct, queryKey: ['singleproduct', id] });

    console.log("My singledata...", singledata)

    const oldImage = singledata?.image?.map((item) => {
        return item
    })

    const onSubmit = async (data, e) => {
        e.preventDefault(); // To stop the default behaviour
        setLoading(true);

        // Handling Form Data
        const formdata = new FormData();
        formdata.append("p_name", data.p_name);
        formdata.append("p_size", size);
        formdata.append("p_color", color);
        images.forEach((image) => formdata.append("image", image)) || formdata.append("image", oldImage)
        formdata.append("category", data.category);
        formdata.append("price", data.price);
        formdata.append("p_description", data.p_description);

        try {
            const response = await updateproduct({ formdata, id });
            console.log("Product Update Response...", response);
            if (response?.status === 200) {
                router.push('/product');
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            setLoading(false);
        }
    };

    const handleSize = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setSize([...size, value]);
        } else {
            setSize(size.filter(item => item !== value));
        }
    };

    const handleColor = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setColor([...color, value]);
        } else {
            setColor(color.filter(item => item !== value));
        }
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
    };

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    }

    console.log("aloka...", images)

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{
                    marginTop: 10,
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2,
                    backgroundColor: 'white',
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.12)'
                }}>
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <EditIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        Update Product
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={3}>
                            {/* Product Name */}
                            <Grid item xs={12}>
                                <TextField
                                    name="p_name"
                                    required
                                    fullWidth
                                    id="p_name"
                                    label="Product Name"
                                    autoFocus
                                    InputLabelProps={{
                                        shrink: true,
                                        style: { fontSize: '1rem' }
                                    }}
                                    {...register("p_name")}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'rgba(25, 118, 210, 0.5)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                            }
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Product Size */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>
                                    Product Size
                                </Typography>
                                <div onChange={handleSize}>
                                    {['s', 'm', 'xl', 'xxl'].map((label) => (
                                        <label key={label} style={{ display: 'block', margin: '5px 0', color: '#555' }}>
                                            <input
                                                type="checkbox"
                                                value={label}
                                                checked={size?.includes(label)}
                                                style={{ marginRight: '8px' }}
                                            />{" "}
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </Grid>

                            {/* Product Color */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>
                                    Product Color
                                </Typography>
                                <div onChange={handleColor}>
                                    {['white', 'purple', 'blue', 'black'].map((label) => (
                                        <label key={label} style={{ display: 'block', margin: '5px 0', color: '#555' }}>
                                            <input
                                                type="checkbox"
                                                value={label}
                                                checked={color?.includes(label)}
                                                style={{ marginRight: '8px' }}
                                            />{" "}
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </Grid>

                            {/* Image Upload */}
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
                                    {images?.map((image, index) => (
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
                                            {image instanceof File ? (
                                                <img
                                                    height="180px"
                                                    src={URL.createObjectURL(image)}
                                                    alt="Uploaded"
                                                    className="upload-img"
                                                    style={{ width: '100%', height: '100%', borderRadius: 5 }}
                                                />
                                            ) : (
                                                <img
                                                    height="180px"
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                                                    alt="Existing Employee"
                                                    className="upload-img"
                                                    style={{ width: '100%', height: '100%', borderRadius: 5 }}
                                                />
                                            )}

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

                            {/* Category */}
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Controller
                                        name="category"
                                        control={control}
                                        defaultValue={singledata?.category || ''}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                labelId="category-label"
                                                id="category"
                                                label="Category"
                                            >
                                                <MenuItem value="fashion">Fashion</MenuItem>
                                                <MenuItem value="electronics">Electronics</MenuItem>
                                                <MenuItem value="food">Food</MenuItem>
                                                <MenuItem value="grocery">Grocery</MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            {/* Product Price */}
                            <Grid item xs={12}>
                                <TextField
                                    name="price"
                                    required
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    {...register("price")}
                                    InputLabelProps={{
                                        shrink: true,
                                        style: { fontSize: '1rem' }
                                    }}
                                />
                            </Grid>

                            {/* Product Description */}
                            <Grid item xs={12}>
                                <TextField
                                    name="p_description"
                                    required
                                    fullWidth
                                    label="Product Description"
                                    {...register("p_description")}
                                    InputLabelProps={{
                                        shrink: true,
                                        style: { fontSize: '1rem' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress color="white" size={24} /> : 'Update Product'}
                                </Button>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Copyright />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Index;
