(defproject reactest "1.0"
  :description "app"
  :url "http://clojure-getting-started.herokuapp.com"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [compojure "1.4.0"]
                 [ring/ring-jetty-adapter "1.4.0"]
                 [environ "1.0.0"]
                 [ring/ring-json "0.3.1"]
                 [c3p0/c3p0 "0.9.1.2"]
                 [org.clojure/java.jdbc "0.2.3"]
                 [com.h2database/h2 "1.3.168"]
                 [cheshire "4.0.3"]
                 ]
  :min-lein-version "2.7.1"
  
  :plugins [[environ/environ.lein "0.3.1"]]
  :hooks [environ.leiningen.hooks]
  :uberjar-name "reactest-standalone.jar"
  :aot  [reactest.web]
  :main reactest.web
  :profiles {:production {:env {:production true}}})
