source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "jekyll-seo-tag", "~> 2.8"
gem "jekyll-sitemap", "~> 1.4"
gem "jekyll-feed", "~> 0.17"

# Logger será removido de las gemas por defecto en Ruby 4.0.0
# Agregarlo explícitamente para evitar warnings
gem "logger"

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
# Nota: Jekyll sugiere agregar 'wdm' para evitar polling, pero wdm no es compatible con Ruby 3.4+.
# Jekyll funcionará perfectamente sin él, solo será un poco más lento al detectar cambios de archivos.
# Si usas Ruby 3.3 o anterior, puedes descomentar la siguiente línea:
# gem "wdm", ">= 0.1.0", :platforms => [:windows]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

