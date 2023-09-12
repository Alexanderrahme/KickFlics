Upload project documentation here so that you can share git commits of any non-coding work within your weekly journal.

-----------------------------------------------------------------------------------------------------------------------------------------------------

Oliver Scott Machine Learning Research 12/9/23:
Data sets:

ImageNet can be useful for training our models. It has A LOT of images and can be useful to us. I created an account with them and requested access.
 
Other datasets:

This dataset has 900 different categories of sneakers, each with more than 50 images. This could be very useful for training the model: https://www.kaggle.com/datasets/huchunjun/sneaker-899classification-total50000images

I also found this dataset on Kaggle, it has about 50,000 images all of which are labelled. This could also be very useful for training our data set: https://www.kaggle.com/datasets/sebastiaanjohn/sneakers




Models:

I have identified two models which seem most appropriate for our task. We want to prioritise speed over accuracy, while still being accurate. A user cant be waiting 10 minutes to see the result of their scan. Also, as I understand it we will give a list of shoes that the scan is most likely to be. This means we can rank the models output in order of highest accuracy.

MobileNetV2: Has inverted residuals and linear bottlenecks. Can reduce computational cost while maintaining accuracy. Might be computationally expensive to scale. This is a tried and tested model, it works.

EfficientNetB0: Seems to outperform MobileNetV2 when trained on ImageNet with regards to accuracy. Seems to scale better. Might offer more variability when it comes to model size, but at an unknown cost to accuracy and compute.

They both are massively large networks. They will each have different costs to hardware in terms of computing power. We might be best to build both and compare the results.


Data Augmentation: 
I looked into data augmentation for our image set. Essentially by rotating/altering existing images in the dataset we can have more inputs for the model. ImageDataGenerator in Keras might be an easy way for us to achieve this. It might make the model more accurate or if we are lacking photos of one shoe we will be able to generate enough inputs for the model.

Links:
ImageNet: https://www.image-net.org/
MobileNetV2: https://au.mathworks.com/help/deeplearning/ref/mobilenetv2.html
EfficientNetB0: https://www.tensorflow.org/api_docs/python/tf/keras/applications/efficientnet/EfficientNetB0
ImageDataGenerator: https://www.tensorflow.org/api_docs/python/tf/keras/preprocessing/image/ImageDataGenerator

End of research
-----------------------------------------------------------------------------------------------------------------------------------------------------
