import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/bacteria/ke/listAll',
    method:'get',
    params:params
  })
}
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
