import request from '@/utils/request'

// export function fetchList(params) {
//   return request({
//     url:'/bacteria/ke/listAll',
//     method:'get',
//     params:params
//   })
// }
export function createKe(data) {
  return request({
    url:'/bacteria/ke/create',
    method:'post',
    data:data
  })
}

export function deleteKe(data) {
  return request({
    url:'/bacteria/ke/delete/'+data,
    method:'post',
    data:data
  })
}

export function updateKe(data) {
  return request({
    url:'/bacteria/ke/update',
    method:'post',
    data:data
  })
}

export function fetchShuList(params) {
  return request({
    url:'/bacteria/genus/listAll',
    method:'get',
    params:params
  })
}
export function createShu(data) {
  return request({
    url:'/bacteria/genus/create',
    method:'post',
    data:data
  })
}

export function deleteShu(data) {
  return request({
    url:'/bacteria/genus/delete/'+data,
    method:'post',
    data:data
  })
}

export function updateShu(data) {
  return request({
    url:'/bacteria/genus/update',
    method:'post',
    data:data
  })
}


export function fetchSpeciesList(params) {
  return request({
    url:'/bacteria/species/listAll',
    method:'get',
    params:params
  })
}
export function createSpecies(data) {
  return request({
    url:'/bacteria/species/create',
    method:'post',
    data:data
  })
}

export function deleteSpecies(data) {
  return request({
    url:'/bacteria/species/delete/'+data,
    method:'post',
    data:data
  })
}

export function updateSpecies(data) {
  return request({
    url:'/bacteria/species/update',
    method:'post',
    data:data
  })
}


export function fetchStrainList(params) {
  return request({
    url:'/bacteria/strain/listAll',
    method:'get',
    params:params
  })
}
export function createStrain(data) {
  return request({
    url:'/bacteria/strain/create',
    method:'post',
    data:data
  })
}

export function deleteStrain(data) {
  return request({
    url:'/bacteria/strain/delete/'+data,
    method:'post',
    data:data
  })
}

export function updateStrain(data) {
  return request({
    url:'/bacteria/strain/update',
    method:'post',
    data:data
  })
}

export function fetchProductsList(params) {
  return request({
    url:'/bacteria/products/listAll',
    method:'get',
    params:params
  })
}
export function createProducts(data) {
  return request({
    url:'/bacteria/products/create',
    method:'post',
    data:data
  })
}

export function deleteProducts(data) {
  return request({
    url:'/bacteria/products/delete/'+data,
    method:'post',
    data:data
  })
}

export function updateProducts(data) {
  return request({
    url:'/bacteria/products/update',
    method:'post',
    data:data
  })
}


export function createProductsRelations(params) {
  return request({
    url:'/bacteria/productsRelations/create',
    method:'post',
    data:params
  })
}

export function fetchProductsRelationsList(params) {
  return request({
    url:'/bacteria/productsRelations/findAll',
    method:'get',
    params:params
  })
}

export function updateProductsRelations(params) {
  return request({
    url:'/bacteria/productsRelations/update',
    method:'post',
    data:params
  })
}
export function deleteProductsRelations(params) {
  return request({
    url:'/bacteria/productsRelations/delete',
    method:'post',
    data:params
  })
}

export function fetchDiseaseList(params) {
  return request({
    url:'/disease/listAll',
    method:'get',
    params:params
  })
}
export function createDisease(data) {
  return request({
    url:'/disease/create',
    method:'post',
    data:data
  })
}

export function deleteDisease(data) {
  return request({
    url:'/disease/delete/'+data,
    method:'post',
    data:data
  })
}

export function updateDisease(data) {
  return request({
    url:'/disease/update',
    method:'post',
    data:data
  })
}

export function createDiseaseRelations(params) {
  return request({
    url:'/disease/relations/create',
    method:'post',
    data:params
  })
}

export function fetchDiseaseRelationsList(params) {
  return request({
    url:'/disease/relations/findAll',
    method:'get',
    params:params
  })
}

export function updateDiseaseRelations(params) {
  return request({
    url:'/disease/relations/update',
    method:'post',
    data:params
  })
}
export function deleteDiseaseRelations(params) {
  return request({
    url:'/disease/relations/delete',
    method:'post',
    data:params
  })
}



//---------------------------------

export function fetchList(params) {
  return request({
    url:'/bacteria/listAll',
    method:'get',
    params:params
  })
}
export function createBacteria(data) {
  return request({
    url:'/bacteria/create',
    method:'post',
    data:data
  })
}

export function deleteBacteria(data) {
  return request({
    url:'/bacteria/delete/'+data,
    method:'post',
    data:data
  })
}

export function updateBacteria(data) {
  return request({
    url:'/bacteria/update',
    method:'post',
    data:data
  })
}


export function createComplication(params) {
  return request({
    url:'/disease/complication/create',
    method:'post',
    data:params
  })
}

export function listAllComplication(params) {
  return request({
    url:'/disease/complication/listAll',
    method:'get',
    params:params
  })
}

export function updateComplication(params) {
  return request({
    url:'/disease/complication/update',
    method:'post',
    data:params
  })
}

export function deleteComplication(params) {
  return request({
    url:'/disease/complication/delete/'+params,
    method:'post',
    data:params
  })
}

export function listAllComplicationType(params) {
  return request({
    url:'/disease/complication/type/listall',
    method:'get',
    params:params
  })
}


export function createBacteriaRelationsComplication(params) {
  return request({
    url:'/bacteria/relations/complication/create',
    method:'post',
    data:params
  })
}

export function listAllBacteriaRelationsComplications(params) {
  return request({
    url:'/bacteria/relations/complication/listAll',
    method:'get',
    params:params
  })
}

export function updateBacteriaRelationsComplication(params) {
  return request({
    url:'/bacteria/relations/complication/update',
    method:'post',
    data:params
  })
}
export function deleteBacteriaRelationsComplication(params) {
  return request({
    url:'/bacteria/relations/complication/delete',
    method:'post',
    data:params
  })
}


export function createExperimentalResource(params) {
  return request({
    url:'/experimental/resource/create',
    method:'post',
    data:params
  })
}

export function listAllExperimentalResources(params) {
  return request({
    url:'/experimental/resource/listAll',
    method:'get',
    params:params
  })
}

export function updateExperimentalResource(params) {
  return request({
    url:'/experimental/resource/update',
    method:'post',
    data:params
  })
}
export function deleteExperimentalResource(params) {
  return request({
    url:'/experimental/resource/delete/'+params,
    method:'post',
    data:params
  })
}



export function createExperimentalResult(params) {
  return request({
    url:'/experimental/result/create',
    method:'post',
    data:params
  })
}

export function listAllExperimentalResults(params) {
  return request({
    url:'/experimental/result/listAll',
    method:'get',
    params:params
  })
}

export function updateExperimentalResult(params) {
  return request({
    url:'/experimental/result/update',
    method:'post',
    data:params
  })
}
export function deleteExperimentalResult(params) {
  return request({
    url:'/experimental/result/delete',
    method:'post',
    data:params
  })
}

export function listPa(params) {
  return request({
    url:'/dda/pa/list',
    method:'get',
    params:params
  })
}