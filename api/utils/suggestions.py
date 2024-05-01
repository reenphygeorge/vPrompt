from services.footage.videodata import search_by_footage
from utils.list import no_repeat_list


async def get_suggestions(db, usecase, footage_id):
    suggestion_datas = []
    videodatas = await search_by_footage(db, footage_id)
    if usecase == "licence_plate":
        for videodata in videodatas:
            suggestion_datas.append(videodata.text_data)
        suggestion_datas = no_repeat_list(suggestion_datas)
        suggestion_datas = suggestion_datas[:4]
        suggestion_datas = [
            f"Find a vehicle with plateNumber: {suggestion_data}"
            for suggestion_data in suggestion_datas
        ]
    elif usecase == "person_detect":
        for videodata in videodatas:
            suggestion_datas.append(videodata.class_name)
        suggestion_datas = no_repeat_list(suggestion_datas)
        suggestion_datas = suggestion_datas[:4]
        suggestion_datas = [
            f"Find  {suggestion_data}" for suggestion_data in suggestion_datas
        ]
    return suggestion_datas
