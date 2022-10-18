import numpy as np
import torch
from torch.utils.data import DataLoader
import torchvision.transforms as transforms
import matplotlib.pyplot as plt
from PIL import Image
import torchvision


train_transforms = transforms.Compose(
    [transforms.Resize((128,128)),
     transforms.RandomHorizontalFlip(),
     transforms.RandomRotation(degrees=10,interpolation=transforms.InterpolationMode.NEAREST),
     transforms.RandomPerspective(distortion_scale=.15,p=.15,interpolation=transforms.InterpolationMode.NEAREST),
     transforms.ToTensor(),
     transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
)
trainset = torchvision.datasets.ImageFolder(
    root ="./imgs/train", 
    transform=train_transforms
    )
classes = trainset.classes
test_transforms = transforms.Compose(
    [transforms.Resize((128,128)),
     transforms.ToTensor(),
     transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
)

class CNN(torch.nn.Module):
  def __init__(self):
    super(CNN, self).__init__()
    self.layer1 = torch.nn.Sequential(
      torch.nn.Conv2d(3, 16, kernel_size=4, stride=1, padding='same'),  #(128 + 2*0 - 4)/1 * 124 * 16
      torch.nn.ReLU(),
      torch.nn.MaxPool2d(kernel_size=2, stride=2),  #64*64*16
      torch.nn.BatchNorm2d(16),     
      torch.nn.Dropout(p=0.3))
        
    self.layer2 = torch.nn.Sequential(
      torch.nn.Conv2d(16, 32, kernel_size=5, stride=1, padding='same'), #64*64*16
      torch.nn.BatchNorm2d(32),
      torch.nn.ReLU(),
      torch.nn.Conv2d(32, 32, kernel_size=5, stride=1, padding='same'), #64*64*32
      torch.nn.BatchNorm2d(32),
      torch.nn.ReLU(),
      # torch.nn.Conv2d(32, 32, kernel_size=5, stride=1, padding='same'), #64*64*32
      # torch.nn.BatchNorm2d(32),
      # torch.nn.ReLU(),
      torch.nn.MaxPool2d(kernel_size=2, stride=2),) 

    self.layer3 = torch.nn.Sequential(
      torch.nn.Conv2d(32, 64, kernel_size=3, stride=1, padding='same'), #32*32*32
      torch.nn.ReLU(),
      torch.nn.BatchNorm2d(64),
      torch.nn.Conv2d(64, 64, kernel_size=3, stride=1, padding='same'), #32*32*64
      torch.nn.ReLU(),
      torch.nn.BatchNorm2d(64),
      # torch.nn.Conv2d(64, 64, kernel_size=3, stride=1, padding='same'), #32*32*64
      # torch.nn.ReLU(),
      torch.nn.MaxPool2d(kernel_size=2, stride=2)) #16*16*64
    
    self.layer4 = torch.nn.Sequential(
      torch.nn.Linear(64*16*16, 32, bias=True),
      torch.nn.ReLU())

    self.fc = torch.nn.Linear(32, len(classes), bias=True)

  def forward(self, x):
    y = self.layer1(x)
    y = self.layer2(y)
    y = self.layer3(y)
    y = y.view(y.size(0), -1)   # Flatten them for FC
    y = self.layer4(y)
    y = self.fc(y)
    return y