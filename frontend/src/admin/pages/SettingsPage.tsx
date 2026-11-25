import { useAdmin } from "../AdminContext"

export default function SettingsPage() {
  const {
    settings,
    form,
    settingsTab,
    setSettingsTab,
    saveSettings,
    updateSetting,
    inputClass,
    cardClass,
  } = useAdmin()

  const tabs = [
    { id: "store", label: "Thông tin cửa hàng" },
    { id: "payment", label: "Thanh toán" },
    { id: "shipping", label: "Vận chuyển" },
    { id: "account", label: "Tài khoản" },
  ]
  const fields: Record<string, Array<{
    key: string
    label: string
    multiline?: boolean
  }>> = {
    store: [
      { key: "storeName", label: "Tên cửa hàng" },
      { key: "email", label: "Email liên hệ" },
      { key: "phone", label: "Số điện thoại" },
      { key: "address", label: "Địa chỉ" },
      { key: "description", label: "Mô tả cửa hàng", multiline: true },
    ],
    payment: [
      { key: "bankName", label: "Tên ngân hàng" },
      { key: "bankAccount", label: "Số tài khoản" },
      { key: "accountHolder", label: "Chủ tài khoản" },
      { key: "paymentNote", label: "Hướng dẫn thanh toán", multiline: true },
    ],
    shipping: [
      { key: "shippingFee", label: "Phí vận chuyển mặc định" },
      { key: "freeShippingFrom", label: "Miễn phí vận chuyển từ" },
      { key: "shippingNote", label: "Thông tin vận chuyển", multiline: true },
    ],
    account: [
      { key: "adminName", label: "Tên quản trị viên" },
      { key: "adminEmail", label: "Email quản trị" },
    ],
  }
  return (
    <>
      <div>
        <h2 className="text-2xl font-bold">Cài đặt</h2>
        <p className="mt-1 text-sm text-[#71809a]">
          Cấu hình hệ thống và thông tin cửa hàng
        </p>
      </div>
      <form onSubmit={saveSettings} className={`${cardClass} p-4 sm:p-6`}>
        <div className="mb-5 flex flex-wrap gap-4 border-b border-[#edf0f5]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSettingsTab(tab.id)}
              className={`border-b-2 px-1 pb-3 text-sm font-medium ${
                settingsTab === tab.id
                  ? "border-[#1a6fdb] text-[#1a6fdb]"
                  : "border-transparent text-[#71809a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {fields[settingsTab].map((field) => (
            <label
              key={field.key}
              className={`block text-sm font-medium text-[#52617a] ${
                field.multiline ? "md:col-span-2" : ""
              }`}
            >
              {field.label}
              {field.multiline ? (
                <textarea
                  rows={4}
                  value={settings[field.key] || ""}
                  onChange={(event) =>
                    updateSetting(field.key, event.target.value)
                  }
                  className={`${inputClass} mt-1`}
                />
              ) : (
                <input
                  value={settings[field.key] || ""}
                  onChange={(event) =>
                    updateSetting(field.key, event.target.value)
                  }
                  className={`${inputClass} mt-1`}
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-[#1a6fdb] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </>
  )
}
