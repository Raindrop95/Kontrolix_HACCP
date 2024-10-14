import http from '../http-common'

class konrolix_api {
  // GET
  // --- CATEGORIES --- //
  // --- 1. Food --- //
  getFoodLogs(qr_code_id) {
    return http.get(`/category/food/getFoodLogs?qr_code_id=${qr_code_id}`)
  }

  getProductNames(company_id) {
    return http.get(`/category/food/getProductNames?company_id=${company_id}`)
  }

  // --- 2. Workspaces --- //

  addNewWorkspaceCode(
    currentQrCode,
    workspace_name,
    preferred_cleaning_agents,
    imageData,
    company_id
  ) {
    const data = {
      currentQrCode: currentQrCode,
      workspace_name: workspace_name,
      preferred_cleaning_agents: preferred_cleaning_agents,
      imageData: imageData,
      company_id: company_id
    }

    return http.post('/category/workspace/addNewWorkspaceCode', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  addNewLocationCode(
    currentQrCode,
    location_name,
    preferred_cleaning_agents,
    imageData,
    company_id
  ) {
    const data = {
      currentQrCode: currentQrCode,
      location_name: location_name,
      preferred_cleaning_agents: preferred_cleaning_agents,
      imageData: imageData,
      company_id: company_id
    }

    return http.post('/category/location/addNewLocationCode', data);
  }


  addWorkspaceLog(qr_code_id, user_id, cleaning_agents, condition_image, company_id) {
    const data = {
      qr_code_id: qr_code_id,
      user_id: user_id,
      cleaning_agents: cleaning_agents,
      condition_image: condition_image,
      company_id: company_id
    }

    return http.post('/category/workspace/addWorkspaceLog', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  addLocationLog(qr_code_id, user_id, cleaning_agents, condition_image, company_id) {
    const data = {
      qr_code_id: qr_code_id,
      user_id: user_id,
      cleaning_agents: cleaning_agents,
      condition_image: condition_image,
      company_id: company_id
    }

    return http.post('/category/location/addLocationLog', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  newCleaningAgent(agent_name, informationSheet, company_id) {
    const data = {
      name: agent_name,
      informationSheet: informationSheet,
      company_id: company_id
    }

    return http.post('/category/workspace/newCleaningAgent', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  editCleaningAgent(agent_id, agent_name, informationSheet) {
    const data = {
      id: agent_id,
      newName: agent_name,
      newInformationSheet: informationSheet
    }

    return http.post('/category/workspace/editCleaningAgent', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  editLocationData(currentQrCode, location_name, preferred_cleaning_agents, imageData, company_id) {
    const data = {
      currentQrCode: currentQrCode,
      location_name: location_name,
      preferred_cleaning_agents: preferred_cleaning_agents,
      imageData: imageData,
      company_id: company_id
    }

    return http.post('/category/location/editLocationData', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteCleaningAgent(agent_id) {
    return http.get(`/category/workspace/deleteCleaningAgent?id=${agent_id}`)
  }
  getInformationSheet(agent_id) {
    return http.get(`/category/workspace/getInformationSheet?id=${agent_id}`)
  }

  getWorkspaceLogImage(log_id) {
    return http.get(`/category/workspace/getWorkspaceLogImage?log_id=${log_id}`)
  }

  getLocationLogImage(log_id) {
    return http.get(`/category/location/getLocationLogImage?log_id=${log_id}`)
  }

  getWorkspaceHistory(company_id) {
    return http.get(`/category/workspace/getWorkspaceHistory?company_id=${company_id}`)
  }

  getLocationHistory(company_id) {
    return http.get(`/category/location/getLocationHistory?company_id=${company_id}`)
  }

  deleteWorkspace(workspace_id) {
    return http.get(`/category/workspace/deleteWorkspace?workspace_id=${workspace_id}`)
  }

  deleteLocation(location_id) {
    return http.get(`/category/location/deleteLocation?location_id=${location_id}`)
  }

  getAllWorkspaces(company_id) {
    return http.get(`/category/workspace/getAllWorkspaces?company_id=${company_id}`)
  }

  getAllLocations(company_id) {
    return http.get(`/category/location/getAllLocations?company_id=${company_id}`)
  }

  getAllCleaningAgents(company_id) {
    return http.get(`/category/workspace/getAllCleaningAgents?company_id=${company_id}`)
  }
  getAllActiveCleaningAgents(company_id) {
    return http.get(`/category/workspace/getAllActiveCleaningAgents?company_id=${company_id}`)
  }
  getCleaningAgentById(id) {
    return http.get(`/category/workspace/getCleaningAgentById?id=${id}`)
  }

  getWorkspaceLogs(qr_code_id) {
    return http.get(`/category/workspace/getWorkspaceLogs?qr_code_id=${qr_code_id}`)
  }

  getLocationLogs(qr_code_id) {
    return http.get(`/category/location/getLocationLogs?qr_code_id=${qr_code_id}`)
  }

  // --- 3. Locations --- //
  getLastReadings(company_id) {
    return http.get(`/category/sensor/getLastReadings?company_id=${company_id}`)
  }
  getActiveSensors(company_id) {
    return http.get(`/category/sensor/getActiveSensors?company_id=${company_id}`)
  }
  getAllSensors(company_id) {
    return http.get(`/category/sensor/getAllSensors?company_id=${company_id}`)
  }
  toggleSensor(sensor_id, isActive) {
    return http.post('/category/sensor/toggleSensor', { sensor_id, isActive })
  }
  deleteSensor(sensorId) {
    return http.delete(`/category/sensor/deleteSensor/${sensorId}`)
  }
  addSensor(company_id, mac_address) {
    return http.post('/category/sensor/addSensor', { company_id, mac_address })
  }
  // --- USER MGNT --- //
  getUserData(user_id) {
    return http.get(`/users/getUserData?user_id=${user_id}`)
  }

  getAllUsers(company_id) {
    return http.get(`/users/getAllUsers?company_id=${company_id}`)
  }

  getUserImage(user_id) {
    return http.get(`/users/getUserImage?user_id=${user_id}`)
  }
  deleteUserImage(user_id) {
    return http.get(`/users/deleteUserImage?user_id=${user_id}`)
  }

  getCompanyInformation(company_id) {
    return http.get(`/users/getCompanyInformation?company_id=${company_id}`)
  }

  changeUserImage(user_id, user_image) {
    const data = {
      user_id: user_id,
      user_image: user_image
    }

    return http.post('/users/changeUserImage', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getRoles() {
    return http.get(`/users/getRoles`)
  }

  // --- HISTORY --- //
  getAllHistoryFoodQrCodes(company_id) {
    return http.get(`/history/getAllHistoryFoodQrCodes?company_id=${company_id}`)
  }

  // --- GENERAL QR-CODES --- //
  getQrCodeInfo(qr_code) {
    return http.get(`/general/qrcode/getQrCodeInfo?qr_code=${qr_code}`)
  }

  getQrCodeStatistic(company_id) {
    return http.get(`/general/qrcode/getQrCodeStatistic?company_id=${company_id}`)
  }

  getAllActiveQrCodes(company_id) {
    return http.get(`/general/qrcode/getAllActiveQrCodes?company_id=${company_id}`)
  }
  getThrowAwayLog(logID) {
    return http.get(`/category/food/getThrowAwayLog?id=${logID}`)
  }
  getDeliveryNote(qr_code_id) {
    return http.get(`/category/food/getDeliveryNote?id=${qr_code_id}`)
  }
  getDeliveryImage(qr_code_id) {
    return http.get(`/category/food/getDeliveryImage?id=${qr_code_id}`)
  }

  // POST
  // --- CATEGORIES --- //
  // --- 1. Food --- //
  changeFoodStatus(
    company_id,
    status_code,
    qr_code_id,
    user_id,
    measured_temperature,
    reported_quantity
  ) {
    return http.post(
      `/category/food/changeFoodStatus?company_id=${company_id}&status_code=${status_code}&qr_code_id=${qr_code_id}&user_id=${user_id}&measured_temperature=${measured_temperature}&reported_quantity=${reported_quantity}`
    )
  }

  throwFoodItemAway(company_id, status_code, qr_code_id, reason, user_id, foodImage) {
    const data = {
      company_id: company_id,
      status_code: status_code,
      qr_code_id: qr_code_id,
      reason: reason,
      user_id: user_id,
      foodImage: foodImage
    }

    return http.post('/category/food/throwFoodItemAway', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  addNewFoodQrCode(
    qr_code_str,
    category_id,
    product_name,
    packed_on_date,
    best_before_date,
    user_id,
    batch_number,
    quantity,
    delivery_temperature,
    delivery_note_image,
    food_item_image,
    company_id
  ) {
    const data = {
      qr_code_str: qr_code_str,
      category_id: category_id,
      product_name: product_name,
      packed_on_date: packed_on_date,
      best_before_date: best_before_date,
      user_id: user_id,
      batch_number: batch_number,
      quantity: quantity,
      delivery_temperature: delivery_temperature,
      delivery_note_image: delivery_note_image,
      food_item_image: food_item_image,
      company_id: company_id
    }

    return http.post('/category/food/addNewFoodQrCode', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  // --- 2. Workspaces --- //

  // --- 3. Locations --- //

  // --- USER MGNT --- //

  updateUser(user_id, username, name, surname, email, newPassword, roles) {
    return http.post(
      `/users/updateUser?user_id=${user_id}&username=${username}&name=${name}&surname=${surname}&email=${email}&password=${newPassword}&roles=${roles}`
    )
  }

  deleteUser(user_id) {
    return http.post(`/users/deleteUser?user_id=${user_id}`)
  }

  // --- HISTORY --- //

  // --- GENERAL QR-CODES --- //

  // --- OIL --- //
  getAllOilChanges(company_id) {
    return http.get(`/category/workspace/getAllOilChanges?company_id=${company_id}`)
  }

  addNewOilChange(company_id, container_name, oil_type, ph_value, quantity, employee_id) {
    return http.post(
      `/category/workspace/addNewOilChange?company_id=${company_id}&container_name=${container_name}&oil_type=${oil_type}&ph_value=${ph_value}&quantity=${quantity}&employee_id=${employee_id}`
    )
  }

  editOilChange(company_id, oilchange_id, container_name, oil_type, ph_value, quantity) {
    return http.post(
      `/category/workspace/editOilChange?company_id=${company_id}&oilchange_id=${oilchange_id}&container_name=${container_name}&oil_type=${oil_type}&ph_value=${ph_value}&quantity=${quantity}`
    )
  }

  deleteOilChange(company_id, oilchange_id) {
    return http.post(
      `/category/workspace/deleteOilChange?company_id=${company_id}&oilchange_id=${oilchange_id}`
    )
  }
}

export default new konrolix_api()
