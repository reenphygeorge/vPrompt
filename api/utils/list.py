def no_repeat_list(list_data):
    new_list = []
    for data in list_data:
        if (data in new_list) == False:
            new_list.append(data)
    return new_list
