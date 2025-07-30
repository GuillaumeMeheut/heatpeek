import {
  CheckCircle,
  Zap,
  Shield,
  Eye,
  Clock,
  BarChart,
  Server,
  Lock,
} from "lucide-react";
import { getI18n } from "@locales/server";

export const revalidate = false;

export default async function Why() {
  const t = await getI18n();

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">{t("nav.why")}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t("why.hero.description")}
        </p>
      </div>

      {/* Main Benefits Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
        {/* Easy to Use Dashboard */}
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold ml-4">
              {t("why.features.dashboard.title")}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t("why.features.dashboard.description")}
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.dashboard.benefits.realtime")}
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.dashboard.benefits.customizable")}
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.dashboard.benefits.responsive")}
            </li>
          </ul>
        </div>

        {/* Lightweight Script */}
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold ml-4">
              {t("why.features.lightweight.title")}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t("why.features.lightweight.description")}
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.lightweight.benefits.footprint")}
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.lightweight.benefits.performance")}
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.lightweight.benefits.loading")}
            </li>
          </ul>
        </div>

        {/* Privacy Focused */}
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold ml-4">
              {t("why.features.privacy.title")}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t("why.features.privacy.description")}
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.privacy.benefits.gdpr")}
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.privacy.benefits.cookies")}
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.privacy.benefits.pii")}
            </li>
          </ul>
        </div>

        {/* No Screen Recording */}
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-3 rounded-lg">
              <Eye className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold ml-4">
              {t("why.features.respect.title")}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {t("why.features.respect.description")}
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.respect.benefits.tracking")}
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.respect.benefits.ethical")}
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {t("why.features.respect.benefits.transparent")}
            </li>
          </ul>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("why.additional.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <BarChart className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold">
                {t("why.additional.analytics.title")}
              </h3>
            </div>
            <p className="text-gray-600">
              {t("why.additional.analytics.description")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Server className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold">
                {t("why.additional.infrastructure.title")}
              </h3>
            </div>
            <p className="text-gray-600">
              {t("why.additional.infrastructure.description")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold">
                {t("why.additional.security.title")}
              </h3>
            </div>
            <p className="text-gray-600">
              {t("why.additional.security.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
