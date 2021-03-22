import { ICommand } from "../../../shared/core/ICQRS"
import { ProductDetail } from "../components/detail/infra/entities/ProductDetail"

export class CreateProductCommandDTO implements ICommand {
    name: string
    price: number
    categoryId: string
    tags?: string[]
    detail: ProductDetail
}
