(ns reactest.db
  (:import [com.mchange.v2.c3p0 ComboPooledDataSource])
    (:require [compojure.core :refer [defroutes GET PUT POST DELETE ANY]]
      [compojure.handler :refer [site]]
      [ring.util.response :refer [redirect]]
      [environ.core :refer [env]]
      [clojure.java.io :refer [file output-stream input-stream resource]]
      [clojure.java.jdbc :as sql]
      [cheshire.core :refer :all]
      [ring.util.request :refer [body-string]]))

(defmacro for-loop [[sym init check change :as params] & steps]
  `(loop [~sym ~init value# nil]
     (if ~check
       (let [new-value# (do ~@steps)]
         (recur ~change new-value#))
       value#)))

(defn rand-str [len]
  (apply str (take len (repeatedly #(char (+ (rand 26) 65))))))

(defn uuid [] (str (java.util.UUID/randomUUID)))

(def db-config
  {:classname "org.h2.Driver"
   :subprotocol "h2"
   :subname "mem:employees"
   :user ""
   :password ""})

(defn pool
  [config]
  (let [cpds (doto (ComboPooledDataSource.)
               (.setDriverClass (:classname config))
               (.setJdbcUrl (str "jdbc:" (:subprotocol config) ":" (:subname config)))
               (.setUser (:user config))
               (.setPassword (:password config))
               (.setMaxPoolSize 6)
               (.setMinPoolSize 1)
               (.setInitialPoolSize 1))]
    {:datasource cpds}))

(defonce pooled-db (delay (pool db-config)))

(defn db-connection [] @pooled-db)


(defn get-all
  []
    (sql/with-connection (db-connection)
                         (sql/with-query-results results
                                                 ["select * from employees"]
                                                 (generate-string (into [] results)))))

(defn get-one
  [id]
  (sql/with-connection (db-connection)
                       (sql/with-query-results results
                                               ["select * from employees where id = ?" id]
                                               (first results))))

(defn create
  [employee]
  (let [id (uuid)]
    (sql/with-connection (db-connection)
                         (let [emp (assoc employee "id" id)]
                           (sql/insert-record :employees emp)))
    (get-one id)))

(defn update
  [id employee]
  (sql/with-connection (db-connection)
                       (let [emp (assoc employee "id" id)]
                         (sql/update-values :employees ["id=?" id] emp)))
  (get-one id))

(defn delete
  [id]
  (sql/with-connection (db-connection)
                       (sql/delete-rows :employees ["id=?" id])))

(defonce initdb
         (do
           (sql/with-connection (db-connection)
                                (sql/create-table :employees [:id "varchar(256)" "primary key"]
                                                  [:name "varchar(1024)"]
                                                  [:age :int]
                                                  [:years :int]))
           (for-loop [i 0 (< i 5) (inc i)]
                     (create {:name (rand-str 5), :age (rand-int 100), :years (rand-int 100)}))))

