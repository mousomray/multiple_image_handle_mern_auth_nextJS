# How to post multiple image in API ? 
1) Keep image field in your model will be Array 
2) Pass req.path after running loop in your controller 
3) Put uploadImage.array('image') this code in your controller route area in the place of .single 