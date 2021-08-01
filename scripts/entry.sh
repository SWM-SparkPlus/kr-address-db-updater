#!/bin/bash

search_dir=$PWD/resources/total

echo $search_dir

for entry in $search_dir
do
  echo $(basename $entry)
done