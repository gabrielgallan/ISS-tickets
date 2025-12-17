import axios from "axios"

async function getData() {
  try {
    const response = await axios.get()

    return response.data
  } catch (err) {
    console.error(
      "Erro:",
      err.response?.status,
      err.response?.data || err.message
    )
  }
}

// const apiResponse = await getData()

// const { current_page, data } = apiResponse.tickets
// const { agents } = apiResponse

// const dataFiltered = data.map((tck) => {
//     const { id, tn, title, user_id } = tck

//     return {
//         id,
//         ticket_id: tn,
//         title,
//         agent: agents[String(user_id)]
//     }
// })

// console.log({
//     current_page,
//     dataFiltered
// })
