import { Customer } from "@/core/model/customer";
import { IssCustomerDTO, IssFetchTicketResponseDTO } from "../dto/fetch-ticket-response.dto";

export class CustomerMapper {
    public static toEntity(
        rawCustomer: IssCustomerDTO, 
    ): Customer {
        return new Customer(
            rawCustomer.id,
            rawCustomer.title,
            rawCustomer.email,
            rawCustomer.phone,
            rawCustomer.street,
            rawCustomer.first_name,
            rawCustomer.last_name,
            rawCustomer.city,
            rawCustomer.country
        )
    }
}