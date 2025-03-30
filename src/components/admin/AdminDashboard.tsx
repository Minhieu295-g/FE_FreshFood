"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"
import {
    Calendar,
    DollarSign,
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Filter,
    Download,
    Search,
    ChevronDown,
    MoreHorizontal,
    RefreshCw,
    CheckCircle,
    Clock,
    Truck,
    Home,
    BarChart3,
    ShoppingBag,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    Bell,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Separator } from "../../components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"

// Sample data for charts and statistics
const monthlySalesData = [
    { name: "Jan", sales: 4000, orders: 240 },
    { name: "Feb", sales: 3000, orders: 198 },
    { name: "Mar", sales: 5000, orders: 305 },
    { name: "Apr", sales: 2780, orders: 189 },
    { name: "May", sales: 1890, orders: 142 },
    { name: "Jun", sales: 2390, orders: 178 },
    { name: "Jul", sales: 3490, orders: 226 },
    { name: "Aug", sales: 2000, orders: 152 },
    { name: "Sep", sales: 2780, orders: 187 },
    { name: "Oct", sales: 1890, orders: 134 },
    { name: "Nov", sales: 4000, orders: 275 },
    { name: "Dec", sales: 3300, orders: 214 },
]

const weeklySalesData = [
    { name: "Mon", sales: 1200, orders: 78 },
    { name: "Tue", sales: 1400, orders: 82 },
    { name: "Wed", sales: 1800, orders: 96 },
    { name: "Thu", sales: 1600, orders: 88 },
    { name: "Fri", sales: 2200, orders: 110 },
    { name: "Sat", sales: 1800, orders: 94 },
    { name: "Sun", sales: 1400, orders: 76 },
]

const dailySalesData = [
    { name: "00:00", sales: 200, orders: 12 },
    { name: "03:00", sales: 100, orders: 8 },
    { name: "06:00", sales: 300, orders: 18 },
    { name: "09:00", sales: 800, orders: 42 },
    { name: "12:00", sales: 1200, orders: 65 },
    { name: "15:00", sales: 1000, orders: 58 },
    { name: "18:00", sales: 1500, orders: 82 },
    { name: "21:00", sales: 800, orders: 45 },
]

const categoryData = [
    { name: "Rau củ", value: 35 },
    { name: "Trái cây", value: 25 },
    { name: "Thịt", value: 20 },
    { name: "Đồ khô", value: 15 },
    { name: "Khác", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const topProducts = [
    {
        id: 1,
        name: "Táo Envy New Zealand (1kg)",
        price: 185000,
        sold: 124,
        stock: 45,
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: 2,
        name: "Thịt heo hữu cơ (500g)",
        price: 89000,
        sold: 98,
        stock: 32,
        image: "/placeholder.svg?height=50&width=50",
    },
    {
        id: 3,
        name: "Rau cải ngọt hữu cơ (500g)",
        price: 35000,
        sold: 87,
        stock: 64,
        image: "/placeholder.svg?height=50&width=50",
    },
    { id: 4, name: "Gạo hữu cơ (5kg)", price: 160000, sold: 76, stock: 28, image: "/placeholder.svg?height=50&width=50" },
    {
        id: 5,
        name: "Sữa tươi hữu cơ (1L)",
        price: 65000,
        sold: 65,
        stock: 53,
        image: "/placeholder.svg?height=50&width=50",
    },
]

const recentOrders = [
    {
        id: "ORD-20240325-7812",
        customer: "Lê Minh Hiếu",
        date: "25/03/2024, 15:30",
        total: 245000,
        status: "delivered",
        items: 4,
    },
    {
        id: "ORD-20240325-7811",
        customer: "Nguyễn Văn An",
        date: "25/03/2024, 14:15",
        total: 178000,
        status: "processing",
        items: 2,
    },
    {
        id: "ORD-20240325-7810",
        customer: "Trần Thị Bình",
        date: "25/03/2024, 12:45",
        total: 320000,
        status: "shipped",
        items: 3,
    },
    {
        id: "ORD-20240325-7809",
        customer: "Phạm Văn Cường",
        date: "25/03/2024, 10:20",
        total: 95000,
        status: "pending",
        items: 1,
    },
    {
        id: "ORD-20240324-7808",
        customer: "Hoàng Thị Dung",
        date: "24/03/2024, 18:30",
        total: 145000,
        status: "delivered",
        items: 2,
    },
    {
        id: "ORD-20240324-7807",
        customer: "Vũ Đình Em",
        date: "24/03/2024, 16:10",
        total: 210000,
        status: "cancelled",
        items: 3,
    },
]

// Status configuration for visual elements
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="h-4 w-4" />,
    },
    processing: {
        label: "Đang xử lý",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <RefreshCw className="h-4 w-4" />,
    },
    shipped: {
        label: "Đang giao hàng",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: <Truck className="h-4 w-4" />,
    },
    delivered: {
        label: "Đã giao hàng",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-4 w-4" />,
    },
    cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <X className="h-4 w-4" />,
    },
}

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState("month")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    // Get chart data based on selected time range
    const getChartData = () => {
        switch (timeRange) {
            case "week":
                return weeklySalesData
            case "day":
                return dailySalesData
            default:
                return monthlySalesData
        }
    }
    console.log(getChartData());
    const chartData = getChartData();


    // Calculate total sales, orders, and customers
    const totalSales = monthlySalesData.reduce((sum, item) => sum + item.sales, 0)
    const totalOrders = monthlySalesData.reduce((sum, item) => sum + item.orders, 0)
    const totalProducts = topProducts.reduce((sum, item) => sum + item.sold, 0)

    // Calculate percentage changes (simulated)
    const salesChange = 12.5
    const ordersChange = 8.3
    const productsChange = -3.2
    const customersChange = 5.7

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="ml-3 text-lg font-semibold text-gray-900">FreshMart Admin</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200 ${mobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setMobileSidebarOpen(false)}
            >
                <div
                    className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center text-white">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span className="ml-2 text-lg font-bold">FreshMart</span>
                        </div>
                        <button
                            onClick={() => setMobileSidebarOpen(false)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="py-4">
                        <SidebarContent />
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 bg-white shadow-sm z-20 w-64 transition-transform duration-200 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 hidden lg:block`}
            >
                <div className="p-4 border-b border-gray-200 flex items-center">
                    <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center text-white">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <span className="ml-2 text-lg font-bold">FreshMart Admin</span>
                </div>

                <div className="py-4">
                    <SidebarContent />
                </div>
            </aside>

            {/* Main content */}
            <main className={`transition-all duration-200 ease-in-out ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"} pt-16 lg:pt-0`}>
                {/* Top navigation */}
                <header className="hidden lg:flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="ml-4 text-xl font-semibold text-gray-800">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Tìm kiếm..." className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white" />
                        </div>

                        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <Separator orientation="vertical" className="h-8" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 focus:outline-none">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-700">Admin User</p>
                                        <p className="text-xs text-gray-500">admin@freshmart.com</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Hồ sơ</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Cài đặt</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Dashboard content */}
                <div className="p-6">
                    {/* Page title and actions */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Tổng quan</h2>
                            <p className="text-gray-600 mt-1">Xem thống kê và phân tích doanh số bán hàng</p>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Hôm nay
                                <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>

                            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                                <Download className="h-4 w-4" />
                                Xuất báo cáo
                            </Button>

                            <Button size="sm" className="flex items-center gap-1.5">
                                <Filter className="h-4 w-4" />
                                Lọc dữ liệu
                            </Button>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard
                            title="Tổng doanh thu"
                            value={formatCurrency(totalSales)}
                            change={salesChange}
                            icon={<DollarSign className="h-5 w-5" />}
                            loading={isLoading}
                        />

                        <StatCard
                            title="Tổng đơn hàng"
                            value={totalOrders.toString()}
                            change={ordersChange}
                            icon={<ShoppingCart className="h-5 w-5" />}
                            loading={isLoading}
                        />

                        <StatCard
                            title="Sản phẩm đã bán"
                            value={totalProducts.toString()}
                            change={productsChange}
                            icon={<Package className="h-5 w-5" />}
                            loading={isLoading}
                        />

                        <StatCard
                            title="Khách hàng mới"
                            value="1,254"
                            change={customersChange}
                            icon={<Users className="h-5 w-5" />}
                            loading={isLoading}
                        />
                    </div>

                    {/* Sales chart */}
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Thống kê doanh số</CardTitle>
                                    <CardDescription>Phân tích doanh số bán hàng theo thời gian</CardDescription>
                                </div>

                                <Select value={timeRange} onValueChange={setTimeRange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Chọn thời gian" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="month">Theo tháng</SelectItem>
                                        <SelectItem value="week">Theo tuần</SelectItem>
                                        <SelectItem value="day">Theo ngày</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-80">
                                    <div className="flex flex-col items-center">
                                        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[400px]">
                                    <Tabs defaultValue="bar">
                                        <div className="flex justify-end mb-4">
                                            <TabsList>
                                                <TabsTrigger value="bar">
                                                    <BarChart3 className="h-4 w-4 mr-1" />
                                                    Cột
                                                </TabsTrigger>
                                                <TabsTrigger value="line">
                                                    <TrendingUp className="h-4 w-4 mr-1" />
                                                    Đường
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="bar" className="mt-0">
                                            {chartData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height={400}>
                                                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="sales" name="Doanh số" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                                        <Bar dataKey="orders" name="Đơn hàng" fill="#10b981" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <p className="text-center text-gray-500">Không có dữ liệu</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="line" className="mt-0">
                                            {chartData.length > 0 ? (
                                                <ResponsiveContainer width="100%" height={400}>
                                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Line type="monotone" dataKey="sales" name="Doanh số" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                        <Line type="monotone" dataKey="orders" name="Đơn hàng" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <p className="text-center text-gray-500">Không có dữ liệu</p>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                                <span className="text-sm text-gray-600">
                        Doanh số tháng này: {formatCurrency(monthlySalesData.reduce((sum, item) => sum + item.sales, 0))}
                    </span>
                            </div>
                            <Button variant="link" size="sm" className="text-indigo-600">
                                Xem báo cáo chi tiết
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                    {/* Product and category stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Top products */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Sản phẩm bán chạy</CardTitle>
                                    <Button variant="outline" size="sm">
                                        Xem tất cả
                                    </Button>
                                </div>
                                <CardDescription>Top 5 sản phẩm bán chạy nhất tháng này</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="flex flex-col items-center">
                                            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Sản phẩm</TableHead>
                                                    <TableHead className="text-right">Giá</TableHead>
                                                    <TableHead className="text-right">Đã bán</TableHead>
                                                    <TableHead className="text-right">Tồn kho</TableHead>
                                                    <TableHead className="text-right">Trạng thái</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {topProducts.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                                                                    <img
                                                                        src={product.image || "/placeholder.svg"}
                                                                        alt={product.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                                <span className="font-medium">{product.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                                                        <TableCell className="text-right">{product.sold}</TableCell>
                                                        <TableCell className="text-right">{product.stock}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge
                                                                variant={
                                                                    product.stock > 20 ? "success" : product.stock > 10 ? "warning" : "destructive"
                                                                }
                                                            >
                                                                {product.stock > 20 ? "Còn hàng" : product.stock > 10 ? "Sắp hết" : "Cần nhập thêm"}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Category distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Phân bố danh mục</CardTitle>
                                <CardDescription>Tỷ lệ sản phẩm bán ra theo danh mục</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="flex flex-col items-center">
                                            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `${value}%`} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                                <div className="w-full space-y-2">
                                    {categoryData.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                ></div>
                                                <span className="text-sm">{category.name}</span>
                                            </div>
                                            <span className="text-sm font-medium">{category.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Recent orders */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Đơn hàng gần đây</CardTitle>
                                <Button variant="outline" size="sm">
                                    Xem tất cả đơn hàng
                                </Button>
                            </div>
                            <CardDescription>Danh sách các đơn hàng mới nhất trong hệ thống</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="flex flex-col items-center">
                                        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mã đơn hàng</TableHead>
                                                <TableHead>Khách hàng</TableHead>
                                                <TableHead>Ngày đặt</TableHead>
                                                <TableHead>Sản phẩm</TableHead>
                                                <TableHead className="text-right">Tổng tiền</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentOrders.map((order) => {
                                                const status = statusConfig[order.status]

                                                return (
                                                    <TableRow key={order.id}>
                                                        <TableCell className="font-medium">{order.id}</TableCell>
                                                        <TableCell>{order.customer}</TableCell>
                                                        <TableCell>{order.date}</TableCell>
                                                        <TableCell>{order.items} sản phẩm</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                                                        <TableCell>
                                                            <Badge className={`${status.color} border`}>
                                <span className="flex items-center gap-1">
                                  {status.icon}
                                    {status.label}
                                </span>
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                                                                    <DropdownMenuItem>Cập nhật trạng thái</DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-600">Hủy đơn hàng</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                            <div className="text-sm text-gray-600">Hiển thị 6 / 248 đơn hàng</div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" disabled>
                                    Trước
                                </Button>
                                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    1
                                </Button>
                                <Button variant="outline" size="sm">
                                    2
                                </Button>
                                <Button variant="outline" size="sm">
                                    3
                                </Button>
                                <Button variant="outline" size="sm">
                                    Sau
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}

// Sidebar content component
const SidebarContent = () => {
    return (
        <div className="space-y-1 px-3">
            <SidebarItem icon={<Home />} label="Dashboard" active />
            <SidebarItem icon={<ShoppingBag />} label="Sản phẩm" />
            <SidebarItem icon={<ShoppingCart />} label="Đơn hàng" />
            <SidebarItem icon={<Users />} label="Khách hàng" />
            <SidebarItem icon={<BarChart3 />} label="Báo cáo" />
            <SidebarItem icon={<Settings />} label="Cài đặt" />
        </div>
    )
}

// Sidebar item component
interface SidebarItemProps {
    icon: React.ReactNode
    label: string
    active?: boolean
}

const SidebarItem = ({ icon, label, active }: SidebarItemProps) => {
    return (
        <button
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                active ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            <span className={`mr-3 ${active ? "text-green-600" : "text-gray-500"}`}>{icon}</span>
            {label}
        </button>
    )
}

// Stat card component
interface StatCardProps {
    title: string
    value: string
    change: number
    icon: React.ReactNode
    loading?: boolean
}

const StatCard = ({ title, value, change, icon, loading = false }: StatCardProps) => {
    return (
        <Card>
            <CardContent className="p-6">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                {icon}
                            </div>
                        </div>
                        <div className="text-2xl font-bold">{value}</div>
                        <div className="flex items-center mt-2">
                            <div className={`flex items-center ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                <span className="text-sm font-medium">{Math.abs(change)}%</span>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">so với tháng trước</span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default AdminDashboard

