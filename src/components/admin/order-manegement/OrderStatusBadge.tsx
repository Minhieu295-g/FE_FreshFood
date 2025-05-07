import { Badge } from "../../../components/ui/badge"
import { Clock, RefreshCw, Truck, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import type { OrderStatus } from "../../../types/order"
import { statusConfig } from "../../../types/order"

interface OrderStatusBadgeProps {
    status: OrderStatus
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
    const config = statusConfig[status]

    const getIcon = () => {
        switch (config.icon) {
            case "Clock":
                return <Clock className="h-4 w-4" />
            case "RefreshCw":
                return <RefreshCw className="h-4 w-4" />
            case "Truck":
                return <Truck className="h-4 w-4" />
            case "CheckCircle":
                return <CheckCircle className="h-4 w-4" />
            case "XCircle":
                return <XCircle className="h-4 w-4" />
            case "AlertTriangle":
                return <AlertTriangle className="h-4 w-4" />
            default:
                return null
        }
    }

    return (
        <Badge className={`${config.color} border`}>
      <span className="flex items-center gap-1">
        {getIcon()}
          {config.label}
      </span>
        </Badge>
    )
}

